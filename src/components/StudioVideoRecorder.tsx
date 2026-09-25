"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  VIDEO_BACKGROUNDS,
  VIDEO_AVATARS,
  VIDEO_FRAME_STYLES,
} from "@/lib/videoThemes";
import {
  Circle,
  Clock,
  Download,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  StopCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
} from "lucide-react";

const MAX_DURATION_SECONDS = 600; // 10 minutes maximum

export function StudioVideoRecorder() {
  const router = useRouter();

  // Customization state
  const [backgroundStyle, setBackgroundStyle] = useState<string>("haiti_flag");
  const [avatarType, setAvatarType] = useState<string>("prof_alex");
  const [frameStyle, setFrameStyle] = useState<string>("rounded");
  const [bannerText, setBannerText] = useState<string>("Aprenda Crioulo Haitiano");

  // Media & Recording state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused" | "recorded"
  >("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Output video state
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Metadata Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled" | "draft">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoInputRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const setupAudioAnalyser = useCallback((stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("AudioContext initialization error:", e);
    }
  }, []);

  const initMedia = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) {
        const vStream = new MediaStream([videoTrack]);
        setCameraStream(vStream);
        if (videoInputRef.current) {
          videoInputRef.current.srcObject = vStream;
          videoInputRef.current.play().catch(() => {});
        }
      }

      if (audioTrack) {
        const aStream = new MediaStream([audioTrack]);
        setAudioStream(aStream);
        setupAudioAnalyser(aStream);
      }
    } catch (err) {
      console.warn("Media devices error:", err);
      setPermissionError(
        "Permissão de câmera ou microfone não concedida. Você ainda pode gravar usando os Mascotes/Bonequinhos com áudio se permitir o microfone."
      );
    }
  }, [setupAudioAnalyser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initMedia();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
      if (audioStream) audioStream.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Real-time Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;
    const dataArray = new Uint8Array(128);

    function renderFrame() {
      if (!isRunning || !ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Calculate audio level from microphone
      let currentAudioLevel = 0;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        currentAudioLevel = sum / (dataArray.length * 255);
        setAudioLevel(currentAudioLevel);
      }

      const isSpeaking = currentAudioLevel > 0.04;

      // 2. Clear canvas & draw background
      ctx.clearRect(0, 0, width, height);

      const bg = VIDEO_BACKGROUNDS[backgroundStyle] || VIDEO_BACKGROUNDS.haiti_flag;
      bg.canvasBg(ctx, width, height);

      // 3. Draw Avatar or Webcam feed based on avatarType
      if (avatarType === "webcam" && videoInputRef.current && videoInputRef.current.readyState >= 2) {
        if (frameStyle === "circle_pip") {
          // Circular PiP in bottom-right
          ctx.save();
          const pipRadius = height * 0.28;
          const pipX = width - pipRadius - 40;
          const pipY = height - pipRadius - 40;

          ctx.beginPath();
          ctx.arc(pipX, pipY, pipRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "#818cf8";
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.clip();

          ctx.drawImage(
            videoInputRef.current,
            pipX - pipRadius,
            pipY - pipRadius,
            pipRadius * 2,
            pipRadius * 2
          );
          ctx.restore();
        } else if (frameStyle === "split") {
          // Split screen left/right
          ctx.save();
          const splitWidth = width * 0.55;
          ctx.beginPath();
          ctx.roundRect(width - splitWidth - 30, 40, splitWidth, height - 120, 24);
          ctx.clip();
          ctx.drawImage(videoInputRef.current, width - splitWidth - 30, 40, splitWidth, height - 120);
          ctx.restore();
        } else {
          // Camera video inset with a margin, so the selected background
          // theme is visible as a frame around it (instead of being
          // fully covered by a true fullscreen draw).
          ctx.save();
          const margin = Math.round(Math.min(width, height) * 0.035);
          const camWidth = width - margin * 2;
          const camHeight = height - margin * 2;
          ctx.beginPath();
          ctx.roundRect(margin, margin, camWidth, camHeight, 20);
          ctx.clip();
          ctx.drawImage(videoInputRef.current, margin, margin, camWidth, camHeight);
          ctx.restore();
        }
      } else {
        // Draw Animated Mascot / Bonequinho
        const avatarPreset = VIDEO_AVATARS[avatarType] || VIDEO_AVATARS.prof_alex;
        const centerX = frameStyle === "split" ? width * 0.32 : width / 2;
        const centerY = frameStyle === "banner" ? height * 0.44 : height * 0.48;
        const avatarSize = Math.min(width, height) * 0.65;

        avatarPreset.drawAvatar(ctx, centerX, centerY, avatarSize, isSpeaking, currentAudioLevel);
      }

      // 4. Draw Topic Banner / Title Overlay if present
      if (bannerText.trim()) {
        ctx.save();
        const bannerHeight = 56;
        const bannerY = height - bannerHeight - 24;

        // Banner backdrop
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.beginPath();
        ctx.roundRect(width * 0.1, bannerY, width * 0.8, bannerHeight, 16);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        // Banner text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bannerText, width / 2, bannerY + bannerHeight / 2);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }

    renderFrame();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [backgroundStyle, avatarType, frameStyle, bannerText]);

  // Recording timer control
  useEffect(() => {
    if (recordingState === "recording") {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= MAX_DURATION_SECONDS - 1) {
            stopRecording();
            return MAX_DURATION_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [recordingState]);

  // Start Recording
  function startRecording() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    setElapsedSeconds(0);
    setSaveError(null);

    // Capture 30fps canvas stream
    const canvasStream = canvas.captureStream(30);

    // Add audio track
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      canvasStream.addTrack(audioStream.getAudioTracks()[0]);
    }

    const mimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    let selectedMime = "";
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const recorder = new MediaRecorder(canvasStream, {
      mimeType: selectedMime || undefined,
      videoBitsPerSecond: 2500000,
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: selectedMime || "video/webm",
      });
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setRecordingState("recorded");
    };

    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setRecordingState("recording");
  }

  function pauseRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
    }
  }

  function resumeRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
    }
  }

  function stopRecording() {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === "recording" ||
        mediaRecorderRef.current.state === "paused")
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  function resetRecording() {
    setRecordedBlob(null);
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl(null);
    setElapsedSeconds(0);
    setRecordingState("idle");
    recordedChunksRef.current = [];
  }

  function downloadLocalCopy() {
    if (!recordedBlob) return;
    const a = document.createElement("a");
    a.href = recordedVideoUrl || URL.createObjectURL(recordedBlob);
    a.download = `kreyol_aula_${Date.now()}.webm`;
    a.click();
  }

  async function handleSaveVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setSaveError("Por favor, preencha o título do vídeo.");
      return;
    }
    if (!recordedBlob) {
      setSaveError("Nenhum vídeo gravado para salvar.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      // 1. Upload Video Blob directly to Vercel Blob (client-side, sem passar pela função serverless)
      const blob = await upload(
        `studio_recording_${Date.now()}.webm`,
        recordedBlob,
        {
          access: "public",
          handleUploadUrl: "/api/videos/upload",
          contentType: recordedBlob.type || "video/webm",
        }
      );

      const videoUrl = blob.url;

      // 2. Calculate Publish Date if Scheduled
      let publishAt: string | null = null;
      let isPublished = true;

      if (publishMode === "draft") {
        isPublished = false;
      } else if (publishMode === "scheduled") {
        if (!scheduledDate) {
          throw new Error("Selecione a data para o agendamento da publicação.");
        }
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime || "18:00"}:00`);
        publishAt = scheduledDateTime.toISOString();
      }

      // 3. Create Video Lesson Record in DB
      const createRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl,
          duration: elapsedSeconds,
          isPublished,
          publishAt,
          isLiveRecording: false,
          customization: {
            backgroundStyle,
            avatarType,
            frameStyle,
            bannerText,
          },
        }),
      });

      if (!createRes.ok) {
        const createErr = await createRes.json().catch(() => ({}));
        throw new Error(createErr.error || "Erro ao registrar o vídeo no banco de dados.");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar vídeo:", err);
      setSaveError(err instanceof Error ? err.message : "Erro ao salvar o vídeo.");
    } finally {
      setSaving(false);
    }
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const remainingSeconds = MAX_DURATION_SECONDS - elapsedSeconds;
  const progressPercent = (elapsedSeconds / MAX_DURATION_SECONDS) * 100;

  return (
    <div className="space-y-8">
      {/* Hidden input video element to receive camera stream */}
      <video ref={videoInputRef} className="hidden" muted playsInline />

      {/* Permission alert if failed */}
      {permissionError && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">{permissionError}</div>
          <Button size="sm" variant="outline" onClick={initMedia}>
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left/Main Column: Canvas / Video Studio Player */}
        <div className="space-y-4 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-black shadow-2xl">
            {/* Live Synthesis Canvas (1280x720 internal resolution) */}
            {recordingState !== "recorded" ? (
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="aspect-video w-full object-contain"
              />
            ) : (
              <video
                src={recordedVideoUrl || ""}
                controls
                className="aspect-video w-full object-contain"
              />
            )}

            {/* Timer Badge and Sound Meter during recording */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/75 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg border border-white/10">
              {recordingState === "recording" && (
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
              <Clock className="h-3.5 w-3.5 text-yellow-400" />
              <span>
                {formatTime(elapsedSeconds)} / {formatTime(MAX_DURATION_SECONDS)}
              </span>
              <span className="text-white/40">|</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Mic className="h-3 w-3" />
                <span
                  className="inline-block h-2 rounded-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.max(4, audioLevel * 60)}px` }}
                />
              </span>
            </div>

            {/* Max Duration Warning Badge */}
            {recordingState === "recording" && remainingSeconds <= 120 && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg animate-bounce">
                <AlertTriangle className="h-3.5 w-3.5" />
                Resta {formatTime(remainingSeconds)}!
              </div>
            )}

            {/* 10-Minute Progress Bar along the bottom of the studio screen */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
              <div
                className={`h-full transition-all duration-200 ${
                  remainingSeconds <= 60
                    ? "bg-red-500"
                    : remainingSeconds <= 180
                    ? "bg-yellow-400"
                    : "bg-[var(--accent)]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Recording Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="flex items-center gap-2">
              {recordingState === "idle" && (
                <Button
                  onClick={startRecording}
                  variant="danger"
                  size="lg"
                  className="gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-lg shadow-red-500/20"
                >
                  <Circle className="h-4 w-4 fill-current" /> Iniciar Gravação (Max 10 min)
                </Button>
              )}

              {recordingState === "recording" && (
                <>
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    className="gap-2"
                  >
                    <Pause className="h-4 w-4" /> Pausar
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="danger"
                    className="gap-2"
                  >
                    <StopCircle className="h-4 w-4" /> Concluir Gravação
                  </Button>
                </>
              )}

              {recordingState === "paused" && (
                <>
                  <Button
                    onClick={resumeRecording}
                    variant="primary"
                    className="gap-2"
                  >
                    <Play className="h-4 w-4 fill-current" /> Retomar
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="danger"
                    className="gap-2"
                  >
                    <StopCircle className="h-4 w-4" /> Concluir Gravação
                  </Button>
                </>
              )}

              {recordingState === "recorded" && (
                <>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> Gravar de Novo
                  </Button>
                  <Button
                    onClick={downloadLocalCopy}
                    variant="secondary"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" /> Baixar Cópia (.webm)
                  </Button>
                </>
              )}
            </div>

            <div className="text-xs text-[var(--text-muted)]">
              {recordingState === "idle"
                ? "Pronto para gravar. Escolha o estilo ao lado."
                : recordingState === "recording"
                ? "Gravando ao vivo..."
                : recordingState === "paused"
                ? "Gravação pausada."
                : "Gravação pronta! Preencha as informações abaixo para publicar."}
            </div>
          </div>
        </div>

        {/* Right Column: Customization Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-5">
            <h3 className="flex items-center gap-2 font-bold text-[var(--text)]">
              <Palette className="h-4 w-4 text-[var(--accent)]" /> Personalização do Vídeo
            </h3>

            {/* 1. Select Avatar / Bonequinho */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Apresentador / Bonequinho
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VIDEO_AVATARS).map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarType(av.id)}
                    className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                      avatarType === av.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/40"
                    }`}
                  >
                    <span className="text-2xl mb-1">{av.icon}</span>
                    <span className="text-xs font-bold text-[var(--text)]">{av.name.split(" ")[0]}</span>
                    <span className="text-[10px] text-[var(--text-muted)] line-clamp-1">{av.name.split("(")[1]?.replace(")", "") || "Vídeo"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select Background Theme */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Imagem de Fundo / Tema
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VIDEO_BACKGROUNDS).map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackgroundStyle(bg.id)}
                    className={`relative overflow-hidden rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      backgroundStyle === bg.id
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/40 shadow-sm"
                        : "border-[var(--border)] hover:border-[var(--accent)]/40"
                    }`}
                  >
                    <div className={`h-8 w-full rounded-lg bg-gradient-to-r ${bg.gradient} mb-1.5`} />
                    <p className="text-xs font-semibold text-[var(--text)] line-clamp-1">{bg.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Frame / Layout Style */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Estilo de Enquadramento
              </label>
              <select
                value={frameStyle}
                onChange={(e) => setFrameStyle(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-2 text-xs text-[var(--text)]"
              >
                {VIDEO_FRAME_STYLES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Topic Banner Text */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Faixa com Título do Tópico
              </label>
              <Input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Ex: Verbos Essenciais em Kreyòl"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save & Schedule Form (Appears when video is recorded) */}
      {recordingState === "recorded" && (
        <form
          onSubmit={handleSaveVideo}
          className="rounded-3xl border border-[var(--accent)]/30 bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold text-[var(--text)]">
                Gravação Concluída ({formatTime(elapsedSeconds)})
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Preencha os detalhes e escolha quando disponibilizar o vídeo aos alunos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4 sm:col-span-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
                  Título do Vídeo *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como se apresentar em Crioulo Haitiano em 3 minutos"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--text)]">
                  Descrição e Notas da Aula (Markdown)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique o vocabulário usado, adicione frases de exemplo, etc."
                  rows={4}
                  className="font-sans"
                />
              </div>
            </div>

            {/* Publication / Scheduling Mode Selector */}
            <div className="space-y-3 sm:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)]">
                Disponibilização para os Alunos
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPublishMode("immediate")}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    publishMode === "immediate"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--surface-2)]"
                  }`}
                >
                  <Sparkles className="h-5 w-5 text-[var(--accent)] mb-2" />
                  <span className="text-sm font-bold text-[var(--text)]">Publicar Imediatamente</span>
                  <span className="text-xs text-[var(--text-secondary)]">Disponível no feed agora</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishMode("scheduled")}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    publishMode === "scheduled"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--surface-2)]"
                  }`}
                >
                  <Calendar className="h-5 w-5 text-amber-500 mb-2" />
                  <span className="text-sm font-bold text-[var(--text)]">Agendar Publicação</span>
                  <span className="text-xs text-[var(--text-secondary)]">Liberar em data e hora escolhida</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishMode("draft")}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    publishMode === "draft"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--surface-2)]"
                  }`}
                >
                  <Layers className="h-5 w-5 text-[var(--text-muted)] mb-2" />
                  <span className="text-sm font-bold text-[var(--text)]">Salvar como Rascunho</span>
                  <span className="text-xs text-[var(--text-secondary)]">Visível apenas para o admin</span>
                </button>
              </div>

              {/* Scheduled Date & Time Pickers */}
              {publishMode === "scheduled" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-amber-300/40 bg-amber-50/50 p-4 dark:bg-amber-950/20">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text)]">
                      Data da Liberação
                    </label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text)]">
                      Horário da Liberação
                    </label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {saveError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-[#dc2626] dark:bg-red-950/30">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={resetRecording}
              disabled={saving}
            >
              Descartar e Gravar Outro
            </Button>

            <Button
              type="submit"
              size="lg"
              disabled={saving || !title.trim()}
              className="gap-2 shadow-lg"
            >
              {saving
                ? "Salvando e Enviando..."
                : publishMode === "scheduled"
                ? "Salvar e Agendar Publicação"
                : publishMode === "draft"
                ? "Salvar como Rascunho"
                : "Salvar e Publicar Vídeo"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
