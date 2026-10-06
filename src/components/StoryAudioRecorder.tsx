"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { convertToMp3 } from "@/lib/audioToMp3";
import {
  STORY_AUDIO_MAX_SECONDS,
  STORY_AUDIO_MIN_SECONDS,
  describeStoryDuration,
  formatStoryTime,
} from "@/lib/storyAudio";

type RecorderState = "idle" | "recording" | "paused" | "processing";

interface Props {
  /** Chamado quando a gravação termina e já foi convertida para MP3. */
  onRecorded: (file: File, durationSeconds: number) => void;
  /** Avisa quando há gravação ou conversão em andamento (para o formulário bloquear o salvamento). */
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
}

const RECORDER_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

function pickRecorderType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return RECORDER_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function timestampName() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `narracao-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.mp3`;
}

export function StoryAudioRecorder({ onRecorded, onBusyChange, disabled }: Props) {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const meterFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  // O tempo gravado é contado só enquanto a gravação está ativa (a pausa não conta).
  const elapsedBeforeRef = useRef(0);
  const segmentStartRef = useRef<number | null>(null);
  const discardRef = useRef(false);
  const mimeRef = useRef<string>("");
  // Sempre a versão mais recente do callback (a conversão termina bem depois do clique em "Gravar").
  const onRecordedRef = useRef(onRecorded);
  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);
  useEffect(() => {
    onBusyChange?.(state !== "idle");
  }, [state, onBusyChange]);

  const currentElapsed = useCallback(() => {
    const running = segmentStartRef.current === null ? 0 : (performance.now() - segmentStartRef.current) / 1000;
    return elapsedBeforeRef.current + running;
  }, []);

  const releaseResources = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (meterFrameRef.current !== null) cancelAnimationFrame(meterFrameRef.current);
    timerRef.current = null;
    meterFrameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    setLevel(0);
  }, []);

  // Se o usuário sair da tela no meio da gravação, o microfone é liberado.
  useEffect(() => () => {
    discardRef.current = true;
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    releaseResources();
  }, [releaseResources]);

  function startMeter(stream: MediaStream) {
    try {
      const Constructor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Constructor) return;
      const context = new Constructor();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) sum += ((sample - 128) / 128) ** 2;
        setLevel(Math.min(1, Math.sqrt(sum / samples.length) * 3));
        meterFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // O medidor de volume é opcional; a gravação segue sem ele.
    }
  }

  async function finish(blob: Blob, seconds: number) {
    setState("processing");
    setProgress(0);
    try {
      if (seconds < STORY_AUDIO_MIN_SECONDS) {
        throw new Error(`Grave pelo menos ${describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} de narração.`);
      }
      // Converter para MP3 dá ao arquivo uma duração confiável (o WebM do
      // MediaRecorder não traz duração) e funciona em qualquer navegador.
      const result = await convertToMp3(blob, {
        onProgress: (stage, fraction) => setProgress(stage === "decoding" ? fraction * 0.3 : 0.3 + fraction * 0.7),
      });
      const file = new File([result.blob], timestampName(), { type: "audio/mpeg" });
      onRecordedRef.current(file, result.duration);
      setElapsed(0);
      setState("idle");
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "Não foi possível processar a gravação.");
      setElapsed(0);
      setState("idle");
    }
  }

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Este navegador não permite gravar áudio. Use o Chrome, Edge, Firefox ou Safari atual, em uma página HTTPS.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      });
      streamRef.current = stream;
      const mimeType = pickRecorderType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mimeRef.current = recorder.mimeType || mimeType || "audio/webm";
      chunksRef.current = [];
      discardRef.current = false;
      elapsedBeforeRef.current = 0;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const seconds = currentElapsed();
        segmentStartRef.current = null;
        releaseResources();
        if (discardRef.current) return;
        void finish(new Blob(chunksRef.current, { type: mimeRef.current }), seconds);
      };
      recorder.onerror = () => {
        discardRef.current = true;
        releaseResources();
        setState("idle");
        setError("O navegador interrompeu a gravação. Tente novamente.");
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      segmentStartRef.current = performance.now();
      startMeter(stream);
      timerRef.current = window.setInterval(() => {
        const seconds = currentElapsed();
        setElapsed(seconds);
        if (seconds >= STORY_AUDIO_MAX_SECONDS) stop();
      }, 200);
      setElapsed(0);
      setState("recording");
    } catch (permissionError) {
      releaseResources();
      const name = permissionError instanceof DOMException ? permissionError.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") setError("Permissão do microfone negada. Libere o microfone nas configurações do navegador e tente de novo.");
      else if (name === "NotFoundError") setError("Nenhum microfone foi encontrado neste dispositivo.");
      else setError("Não foi possível acessar o microfone.");
      setState("idle");
    }
  }

  function togglePause() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      elapsedBeforeRef.current = currentElapsed();
      segmentStartRef.current = null;
      recorder.pause();
      setState("paused");
    } else if (recorder.state === "paused") {
      segmentStartRef.current = performance.now();
      recorder.resume();
      setState("recording");
    }
  }

  function stop() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    // Congela o relógio antes do stop() para o tempo final não incluir a latência do navegador.
    elapsedBeforeRef.current = currentElapsed();
    segmentStartRef.current = null;
    recorder.stop();
  }

  function cancel() {
    discardRef.current = true;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    releaseResources();
    setElapsed(0);
    setState("idle");
  }

  const active = state === "recording" || state === "paused";

  return (
    <div className="space-y-3">
      {state === "idle" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] p-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={() => void start()} disabled={disabled} className="shrink-0">
            <Mic className="h-4 w-4" /> Gravar narração
          </Button>
          <p className="text-xs text-[var(--text-muted)]">
            Grave direto pelo microfone, de {describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} a {describeStoryDuration(STORY_AUDIO_MAX_SECONDS)}. Ao parar, a gravação é convertida em MP3 e fica pronta para ouvir antes de salvar.
          </p>
        </div>
      )}

      {active && (
        <div className="space-y-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] p-4" role="status" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <span className={`h-2.5 w-2.5 rounded-full bg-red-600 ${state === "recording" ? "animate-pulse" : "opacity-40"}`} />
              {state === "recording" ? "Gravando" : "Em pausa"}
              <span className="tabular-nums text-[var(--text-secondary)]">{formatStoryTime(elapsed)} / {formatStoryTime(STORY_AUDIO_MAX_SECONDS)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={togglePause}>
                {state === "recording" ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4" /> Continuar</>}
              </Button>
              <Button type="button" size="sm" onClick={stop}><Square className="h-4 w-4" /> Parar e usar</Button>
              <Button type="button" variant="ghost" size="sm" onClick={cancel} className="text-red-600"><Trash2 className="h-4 w-4" /> Descartar</Button>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--border-soft)]" aria-hidden="true">
            <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-100" style={{ width: `${state === "recording" ? Math.round(level * 100) : 0}%` }} />
          </div>
          {elapsed < STORY_AUDIO_MIN_SECONDS && <p className="text-xs text-[var(--text-muted)]">Mínimo de {describeStoryDuration(STORY_AUDIO_MIN_SECONDS)} para usar a gravação.</p>}
        </div>
      )}

      {state === "processing" && (
        <LoadingSpinner layout="inline" size="sm" label="Convertendo gravação para MP3…" progress={progress * 100} />
      )}

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
