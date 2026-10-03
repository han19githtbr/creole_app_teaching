"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImageBankPicker } from "@/components/ImageBankPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";

type Caption = { start: number; end: number; kreyol: string; portuguese: string };
type InitialStory = {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  publishAt: string | null;
  story: { imageSrc: string; theme: string; audioUrl: string; captions: Caption[] };
};

const initialCaptions = (): Caption[] => [0, 1, 2, 3, 4].map((index) => ({
  start: index * 60,
  end: (index + 1) * 60,
  kreyol: "",
  portuguese: "",
}));

export function StoryForm({ initial }: { initial?: InitialStory }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageSrc, setImageSrc] = useState(initial?.story.imageSrc ?? "");
  const [theme, setTheme] = useState(initial?.story.theme ?? "");
  const audioUrl = initial?.story.audioUrl ?? "";
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [captions, setCaptions] = useState<Caption[]>(initial?.story.captions ?? initialCaptions());
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled" | "draft">(
    !initial?.isPublished ? "draft" : initial.publishAt && new Date(initial.publishAt) > new Date() ? "scheduled" : "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState(initial?.publishAt?.slice(0, 10) ?? "");
  const [scheduledTime, setScheduledTime] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeCaption(index: number, key: keyof Caption, value: string) {
    setCaptions((items) => items.map((item, itemIndex) => itemIndex === index
      ? { ...item, [key]: key === "kreyol" || key === "portuguese" ? value : Number(value) }
      : item));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!imageSrc) return setError("Escolha uma imagem para a história.");
    if (!audioUrl && !audioFile) return setError("Envie o áudio narrado em Kreyòl.");
    if ((audioFile || audioUrl) && audioDuration < 300) return setError("A narração precisa ter pelo menos 5 minutos.");
    if (captions.some((caption) => !caption.kreyol.trim() || !caption.portuguese.trim())) {
      return setError("Preencha os textos em Kreyòl e português de todos os trechos.");
    }

    setSaving(true);
    try {
      let finalAudioUrl = audioUrl;
      if (audioFile) {
        const blob = await upload(audioFile.name, audioFile, {
          access: "public",
          handleUploadUrl: "/api/stories/upload",
          contentType: audioFile.type || "audio/mpeg",
        });
        finalAudioUrl = blob.url;
      }

      let publishAt: string | null = null;
      if (publishMode === "scheduled") {
        if (!scheduledDate) throw new Error("Selecione a data de publicação.");
        publishAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      }
      const response = await fetch(initial ? `/api/stories/${initial._id}` : "/api/stories", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          isPublished: publishMode !== "draft",
          publishAt,
          story: { imageSrc, theme, audioUrl: finalAudioUrl, captions },
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Não foi possível salvar a história.");
      }
      router.push("/admin/stories");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro ao salvar história.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--text)]">Título da história
            <Input className="mt-1.5" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} placeholder="Ex.: O tambor que chamou a chuva" />
          </label>
          <label className="block text-sm font-semibold text-[var(--text)]">Apresentação
            <Textarea className="mt-1.5" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Uma breve introdução à aventura..." />
          </label>
          <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--accent)]" /> História de 5 minutos com cenas animadas e narração em Kreyòl.
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-[#1d3028] text-white">
          {imageSrc ? <Image src={imageSrc} alt="Cena escolhida" width={900} height={600} unoptimized className="aspect-[3/2] w-full object-cover" /> : <div className="flex aspect-[3/2] flex-col items-center justify-center gap-2 text-white/70"><ImageIcon className="h-8 w-8" /><span className="text-xs">Escolha uma cena temática</span></div>}
          <div className="flex items-center justify-between px-3 py-2 text-xs"><span>{theme || "Cena da história"}</span><span>05:00</span></div>
        </div>
        <details className="sm:col-span-2">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[var(--accent)]"><ImageIcon className="h-4 w-4" /> {imageSrc ? "Trocar imagem temática" : "Escolher imagem temática"}</summary>
          <div className="mt-4"><ImageBankPicker selectedSrc={imageSrc || null} onSelect={(image) => { setImageSrc(image?.src ?? ""); setTheme(image?.theme ?? ""); }} /></div>
        </details>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div><h2 className="font-semibold text-[var(--text)]">Narração em Kreyòl</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Envie uma gravação de 5 minutos ou mais, em MP3, WAV, M4A, OGG ou WebM.</p></div>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] p-4 hover:border-[var(--accent)]">
          <Upload className="h-5 w-5 text-[var(--accent)]" />
          <span className="min-w-0 flex-1 text-sm text-[var(--text)]">{audioFile ? audioFile.name : audioUrl ? "Narração já enviada" : "Selecionar arquivo de áudio"}<span className="block text-xs text-[var(--text-muted)]">{audioDuration ? `${Math.floor(audioDuration / 60)} min ${Math.round(audioDuration % 60)} s` : "Máximo 30 MB"}</span></span>
          <input type="file" accept="audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,audio/webm" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setAudioFile(file);
            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = () => { setAudioDuration(audio.duration); URL.revokeObjectURL(audio.src); };
          }} />
        </label>
        {audioUrl && !audioFile && <audio controls src={audioUrl} crossOrigin="anonymous" onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration)} className="w-full" />}
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-semibold text-[var(--text)]">Roteiro e legendas</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Divida a narração em trechos; as duas línguas aparecem sincronizadas durante o vídeo.</p></div><Button type="button" variant="outline" size="sm" onClick={() => setCaptions((items) => [...items, { start: items.at(-1)?.end ?? 0, end: Math.min((items.at(-1)?.end ?? 0) + 30, 300), kreyol: "", portuguese: "" }])} disabled={(captions.at(-1)?.end ?? 0) >= 300}><Plus className="h-4 w-4" /> Adicionar trecho</Button></div>
        <div className="space-y-3">
          {captions.map((caption, index) => <div key={index} className="grid gap-3 rounded-lg border border-[var(--border-soft)] p-3 sm:grid-cols-[110px_1fr_1fr_36px]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1"><label className="text-[10px] font-medium text-[var(--text-muted)]">Início (s)<Input type="number" min="0" max="299" value={caption.start} onChange={(event) => changeCaption(index, "start", event.target.value)} className="mt-1 h-8" /></label><label className="text-[10px] font-medium text-[var(--text-muted)]">Fim (s)<Input type="number" min="1" max="300" value={caption.end} onChange={(event) => changeCaption(index, "end", event.target.value)} className="mt-1 h-8" /></label></div>
            <label className="text-[10px] font-semibold text-[var(--text-muted)]">KREYÒL<Textarea value={caption.kreyol} onChange={(event) => changeCaption(index, "kreyol", event.target.value)} rows={2} required className="mt-1 text-sm font-normal" placeholder="Sa k ap pase nan istwa a..." /></label>
            <label className="text-[10px] font-semibold text-[var(--text-muted)]">PORTUGUÊS<Textarea value={caption.portuguese} onChange={(event) => changeCaption(index, "portuguese", event.target.value)} rows={2} required className="mt-1 text-sm font-normal" placeholder="Tradução da fala..." /></label>
            <Button type="button" variant="ghost" size="sm" title="Remover trecho" aria-label="Remover trecho" disabled={captions.length === 1} onClick={() => setCaptions((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="self-center px-2 text-red-600"><Trash2 className="h-4 w-4" /></Button>
          </div>)}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold text-[var(--text)]">Publicação</h2>
        <div className="grid gap-2 sm:grid-cols-3">{([
          ["immediate", "Publicar agora"], ["scheduled", "Agendar"], ["draft", "Salvar rascunho"],
        ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setPublishMode(value)} className={`rounded-lg border px-3 py-3 text-sm font-medium ${publishMode === value ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>{value === "scheduled" && <Calendar className="mr-1 inline h-4 w-4" />}{label}</button>)}</div>
        {publishMode === "scheduled" && <div className="grid max-w-md grid-cols-2 gap-3"><Input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required /><Input type="time" value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)} required /></div>}
      </section>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar história"}</Button></div>
    </form>
  );
}
