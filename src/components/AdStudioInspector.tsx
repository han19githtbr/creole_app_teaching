"use client";

import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Lock, Trash2, Unlock } from "lucide-react";
import { FONT_LABELS } from "@/lib/adStudio/palettes";
import { LAYER_KIND_LABEL } from "@/lib/adStudio/layers";
import type { FontId, Layer, LibImage, Palette, ScreenKind } from "@/lib/adStudio/types";
import { cn } from "@/lib/utils";
import { ColorField, Field, NumberBox, NumberSlider, Section, Segmented, Select, TextArea, TextInput, Toggle } from "./AdStudioControls";

const FONT_OPTIONS = (Object.keys(FONT_LABELS) as FontId[]).map((v) => ({ value: v, label: FONT_LABELS[v] }));
const SCREEN_OPTIONS: { value: ScreenKind; label: string }[] = [
  { value: "lessons", label: "Lições" },
  { value: "game", label: "Jogo" },
  { value: "ranking", label: "Ranking" },
  { value: "video", label: "Aula em vídeo" },
  { value: "story", label: "História animada" },
  { value: "live", label: "Aula ao vivo" },
  { value: "achievements", label: "Níveis e conquistas" },
];
const SCREEN_HELP: Record<ScreenKind, string> = {
  lessons: "Uma linha por lição: Título|Categoria",
  game: "Uma opção por linha; comece com ✓ nas corretas. Título = nome do jogo.",
  ranking: "Uma linha por jogador: Nome|pontos",
  video: "1ª linha = subtítulo; as seguintes = outros vídeos.",
  story: "Uma palavra por linha (rótulos na cena). Título = legenda em português.",
  live: "1ª linha = espectadores; depois mensagens Nome|texto. Título = campo de chat.",
  achievements: "Título = emoji|nome do nível. Itens = emoji|nome da conquista.",
};

interface Props {
  layer: Layer | undefined;
  palette: Palette;
  images: LibImage[];
  onChange: (patch: Partial<Layer>, key?: string) => void;
  onPickImage: (target: "layer") => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onOrder: (dir: "up" | "down" | "front" | "back") => void;
  onAlign: (a: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
}

export function Inspector({ layer, palette, onChange, onPickImage, onDelete, onDuplicate, onOrder, onAlign }: Props) {
  if (!layer) {
    return <p className="p-3 text-sm text-[var(--text-muted)]">Clique em um elemento da peça (ou na lista de camadas) para editar texto, cores, tamanho e posição.</p>;
  }
  const set = (patch: Record<string, unknown>, key?: string) => onChange(patch as Partial<Layer>, key);
  const L = layer;
  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <input
          value={L.name}
          onChange={(e) => set({ name: e.target.value }, `name:${L.id}`)}
          className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 text-sm font-bold text-[var(--text)] hover:border-[var(--border)] focus:border-[var(--accent-soft)] focus:outline-none"
        />
        <span className="shrink-0 rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[var(--text-muted)]">{LAYER_KIND_LABEL[L.kind]}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <IconBtn title="Duplicar (Ctrl+D)" onClick={onDuplicate}><Copy className="h-4 w-4" /></IconBtn>
        <IconBtn title="Trazer para frente" onClick={() => onOrder("up")}><ArrowUp className="h-4 w-4" /></IconBtn>
        <IconBtn title="Enviar para trás" onClick={() => onOrder("down")}><ArrowDown className="h-4 w-4" /></IconBtn>
        <IconBtn title={L.hidden ? "Mostrar" : "Ocultar"} onClick={() => set({ hidden: !L.hidden })}>{L.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</IconBtn>
        <IconBtn title={L.locked ? "Destravar" : "Travar"} onClick={() => set({ locked: !L.locked })}>{L.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}</IconBtn>
        <IconBtn title="Excluir (Delete)" onClick={onDelete} danger><Trash2 className="h-4 w-4" /></IconBtn>
      </div>

      {L.kind === "text" && (
        <Section title="Texto">
          <TextArea value={L.text} rows={3} data-ad-focus="text" onChange={(v) => set({ text: v }, `text:${L.id}`)} />
          <div className="grid grid-cols-2 gap-2">
            <Select label="Fonte" value={L.font} options={FONT_OPTIONS} onChange={(v) => set({ font: v })} />
            <Select label="Peso" value={String(L.weight) as "400"} options={[{ value: "400", label: "Normal" }, { value: "600", label: "Médio" }, { value: "700", label: "Negrito" }, { value: "800", label: "Extra" }, { value: "900", label: "Ultra" }]} onChange={(v) => set({ weight: Number(v) })} />
          </div>
          <NumberSlider label="Tamanho" value={L.size} min={14} max={260} onChange={(v) => set({ size: v }, `size:${L.id}`)} suffix="px" />
          <Segmented value={L.align} options={[{ value: "left", label: "Esq." }, { value: "center", label: "Centro" }, { value: "right", label: "Dir." }]} onChange={(v) => set({ align: v })} />
          <Segmented value={L.valign} options={[{ value: "top", label: "Topo" }, { value: "middle", label: "Meio" }, { value: "bottom", label: "Base" }]} onChange={(v) => set({ valign: v })} />
          <ColorField label="Cor do texto" value={L.color} palette={palette} onChange={(v) => set({ color: v })} />
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Toggle label="Itálico" value={L.italic} onChange={(v) => set({ italic: v })} />
            <Toggle label="MAIÚSCULAS" value={L.uppercase} onChange={(v) => set({ uppercase: v })} />
            <Toggle label="Ajuste automático" value={L.autoFit} onChange={(v) => set({ autoFit: v })} />
            <Toggle label="Sombra" value={!!L.shadow} onChange={(v) => set({ shadow: v })} />
          </div>
          <NumberSlider label="Altura da linha" value={L.lineHeight} min={0.8} max={2} step={0.02} onChange={(v) => set({ lineHeight: v }, `lh:${L.id}`)} />
          <NumberSlider label="Espaço entre letras" value={L.letterSpacing} min={-4} max={20} step={0.5} onChange={(v) => set({ letterSpacing: v }, `ls:${L.id}`)} />
          <ColorField label="Fundo do texto (etiqueta)" value={L.bgColor} palette={palette} allowEmpty onChange={(v) => set({ bgColor: v })} />
          {L.bgColor && (
            <div className="grid grid-cols-2 gap-2">
              <NumberSlider label="Arredondar" value={L.bgRadius} min={0} max={80} onChange={(v) => set({ bgRadius: v }, `bgr:${L.id}`)} />
              <NumberSlider label="Margem" value={L.bgPadding} min={0} max={60} onChange={(v) => set({ bgPadding: v }, `bgp:${L.id}`)} />
            </div>
          )}
          <ColorField label="Contorno" value={L.strokeColor} palette={palette} allowEmpty onChange={(v) => set({ strokeColor: v, strokeWidth: v ? Math.max(L.strokeWidth, 6) : 0 })} />
          {L.strokeColor && <NumberSlider label="Espessura do contorno" value={L.strokeWidth} min={0} max={30} onChange={(v) => set({ strokeWidth: v }, `sw:${L.id}`)} />}
        </Section>
      )}

      {L.kind === "image" && (
        <Section title="Imagem">
          <button type="button" onClick={() => onPickImage("layer")} className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface)]">🖼️ Trocar imagem (aba Imagens)</button>
          <Segmented value={L.fit} options={[{ value: "cover", label: "Preencher" }, { value: "contain", label: "Encaixar" }]} onChange={(v) => set({ fit: v })} />
          <NumberSlider label="Zoom" value={L.zoom} min={0.5} max={3} step={0.05} onChange={(v) => set({ zoom: v }, `z:${L.id}`)} />
          <NumberSlider label="Foco horizontal" value={L.focusX} min={0} max={100} onChange={(v) => set({ focusX: v }, `fx:${L.id}`)} suffix="%" />
          <NumberSlider label="Foco vertical" value={L.focusY} min={0} max={100} onChange={(v) => set({ focusY: v }, `fy:${L.id}`)} suffix="%" />
          <NumberSlider label="Cantos arredondados" value={L.radius} min={0} max={Math.round(Math.max(L.w, L.h) / 2)} onChange={(v) => set({ radius: v }, `r:${L.id}`)} />
          <NumberSlider label="Borda" value={L.borderWidth} min={0} max={40} onChange={(v) => set({ borderWidth: v }, `bw:${L.id}`)} />
          {L.borderWidth > 0 && <ColorField label="Cor da borda" value={L.borderColor} palette={palette} onChange={(v) => set({ borderColor: v })} />}
          <Toggle label="Sombra" value={!!L.shadow} onChange={(v) => set({ shadow: v })} />
        </Section>
      )}

      {L.kind === "shape" && (
        <Section title="Forma">
          <Segmented value={L.shape} options={[{ value: "rect", label: "Retângulo" }, { value: "circle", label: "Círculo" }]} onChange={(v) => set({ shape: v })} />
          <ColorField label="Cor" value={L.fill} palette={palette} allowEmpty onChange={(v) => set({ fill: v })} />
          <ColorField label="Cor final (degradê)" value={L.fill2} palette={palette} allowEmpty onChange={(v) => set({ fill2: v })} />
          {L.fill2 && <NumberSlider label="Ângulo do degradê" value={L.angle} min={0} max={360} onChange={(v) => set({ angle: v }, `an:${L.id}`)} suffix="°" />}
          {L.shape === "rect" && <NumberSlider label="Cantos arredondados" value={L.radius} min={0} max={Math.round(Math.max(L.w, L.h) / 2)} onChange={(v) => set({ radius: v }, `r:${L.id}`)} />}
          <NumberSlider label="Contorno" value={L.strokeWidth} min={0} max={30} onChange={(v) => set({ strokeWidth: v }, `sw:${L.id}`)} />
          {L.strokeWidth > 0 && <ColorField label="Cor do contorno" value={L.strokeColor} palette={palette} onChange={(v) => set({ strokeColor: v })} />}
          <Toggle label="Sombra" value={!!L.shadow} onChange={(v) => set({ shadow: v })} />
        </Section>
      )}

      {L.kind === "phone" && (
        <Section title="Celular (tela do app)">
          <Select label="Tela mostrada" value={L.screen} options={SCREEN_OPTIONS} onChange={(v) => set({ screen: v })} />
          <p className="text-[11px] text-[var(--text-muted)]">{SCREEN_HELP[L.screen]}</p>
          <Field label="Título"><TextInput value={L.title} onChange={(v) => set({ title: v }, `pt:${L.id}`)} /></Field>
          <Field label="Itens (um por linha)"><TextArea value={L.items.join("\n")} rows={6} onChange={(v) => set({ items: v.split("\n") }, `pi:${L.id}`)} /></Field>
          {(L.screen === "game" || L.screen === "video" || L.screen === "story" || L.screen === "live") && (
            <button type="button" onClick={() => onPickImage("layer")} className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface)]">🖼️ Escolher imagem da tela</button>
          )}
          <ColorField label="Cor de destaque da tela" value={L.accentColor} palette={palette} onChange={(v) => set({ accentColor: v })} />
          <ColorField label="Moldura" value={L.frameColor} palette={palette} onChange={(v) => set({ frameColor: v })} />
          <Toggle label="Sombra" value={L.shadow !== false} onChange={(v) => set({ shadow: v })} />
        </Section>
      )}

      {L.kind === "card" && (
        <Section title="Cartão de funcionalidade">
          <div className="grid grid-cols-[64px_1fr] gap-2">
            <Field label="Ícone"><TextInput value={L.icon} onChange={(v) => set({ icon: v })} /></Field>
            <Field label="Título"><TextInput value={L.title} onChange={(v) => set({ title: v }, `ct:${L.id}`)} /></Field>
          </div>
          <Field label="Descrição"><TextArea value={L.desc} rows={2} onChange={(v) => set({ desc: v }, `cd:${L.id}`)} /></Field>
          <Segmented value={L.layout} options={[{ value: "row", label: "Horizontal" }, { value: "column", label: "Vertical" }]} onChange={(v) => set({ layout: v })} />
          <ColorField label="Fundo" value={L.fill} palette={palette} onChange={(v) => set({ fill: v })} />
          <ColorField label="Texto" value={L.textColor} palette={palette} onChange={(v) => set({ textColor: v })} />
          <ColorField label="Cor do ícone" value={L.accentColor} palette={palette} onChange={(v) => set({ accentColor: v })} />
          <NumberSlider label="Cantos arredondados" value={L.radius} min={0} max={80} onChange={(v) => set({ radius: v }, `r:${L.id}`)} />
        </Section>
      )}

      {L.kind === "stat" && (
        <Section title="Número em destaque">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Valor"><TextInput value={L.value} onChange={(v) => set({ value: v }, `sv:${L.id}`)} /></Field>
            <Field label="Legenda"><TextInput value={L.label} onChange={(v) => set({ label: v }, `sl:${L.id}`)} /></Field>
          </div>
          <ColorField label="Fundo" value={L.fill} palette={palette} onChange={(v) => set({ fill: v })} />
          <ColorField label="Cor do valor" value={L.valueColor} palette={palette} onChange={(v) => set({ valueColor: v })} />
          <ColorField label="Cor da legenda" value={L.labelColor} palette={palette} onChange={(v) => set({ labelColor: v })} />
        </Section>
      )}

      {L.kind === "list" && (
        <Section title="Lista de benefícios">
          <Field label="Itens (um por linha)"><TextArea value={L.items.join("\n")} rows={5} onChange={(v) => set({ items: v.split("\n") }, `li:${L.id}`)} /></Field>
          <Field label="Marcador (vazio = ✔ desenhado)"><TextInput value={L.bullet === "✔" ? "" : L.bullet} placeholder="✔" onChange={(v) => set({ bullet: v || "✔" })} /></Field>
          <NumberSlider label="Tamanho" value={L.size} min={16} max={90} onChange={(v) => set({ size: v }, `ls:${L.id}`)} suffix="px" />
          <NumberSlider label="Espaço entre itens" value={L.gap} min={0} max={60} onChange={(v) => set({ gap: v }, `lg:${L.id}`)} />
          <ColorField label="Texto" value={L.color} palette={palette} onChange={(v) => set({ color: v })} />
          <ColorField label="Marcador" value={L.bulletColor} palette={palette} onChange={(v) => set({ bulletColor: v })} />
        </Section>
      )}

      {L.kind === "button" && (
        <Section title="Botão (chamada para ação)">
          <div className="grid grid-cols-[64px_1fr] gap-2">
            <Field label="Ícone"><TextInput value={L.icon} onChange={(v) => set({ icon: v })} /></Field>
            <Field label="Texto"><TextInput value={L.text} onChange={(v) => set({ text: v }, `bt:${L.id}`)} /></Field>
          </div>
          <Toggle label="Seta →" value={L.arrow} onChange={(v) => set({ arrow: v })} />
          <ColorField label="Cor inicial" value={L.fill} palette={palette} onChange={(v) => set({ fill: v })} />
          <ColorField label="Cor final" value={L.fill2} palette={palette} onChange={(v) => set({ fill2: v })} />
          <ColorField label="Cor do texto" value={L.color} palette={palette} onChange={(v) => set({ color: v })} />
          <NumberSlider label="Tamanho do texto" value={L.size} min={16} max={100} onChange={(v) => set({ size: v }, `bs:${L.id}`)} />
          <NumberSlider label="Cantos arredondados" value={L.radius} min={0} max={80} onChange={(v) => set({ radius: v }, `r:${L.id}`)} />
          <Toggle label="Sombra" value={L.shadow !== false} onChange={(v) => set({ shadow: v })} />
        </Section>
      )}

      <Section title="Posição e tamanho">
        <div className="grid grid-cols-2 gap-2">
          <NumberBox label="X" value={L.x} onChange={(v) => set({ x: v }, `x:${L.id}`)} />
          <NumberBox label="Y" value={L.y} onChange={(v) => set({ y: v }, `y:${L.id}`)} />
          <NumberBox label="Largura" value={L.w} onChange={(v) => set(L.kind === "phone" ? { w: Math.max(40, v), h: Math.round(Math.max(40, v) / 0.49) } : { w: Math.max(20, v) }, `w:${L.id}`)} />
          <NumberBox label="Altura" value={L.h} onChange={(v) => set(L.kind === "phone" ? { h: Math.max(80, v), w: Math.round(Math.max(80, v) * 0.49) } : { h: Math.max(20, v) }, `h:${L.id}`)} />
        </div>
        <NumberSlider label="Rotação" value={L.rotation} min={-180} max={180} onChange={(v) => set({ rotation: v }, `rot:${L.id}`)} suffix="°" />
        <NumberSlider label="Opacidade" value={L.opacity} min={0} max={1} step={0.02} onChange={(v) => set({ opacity: v }, `op:${L.id}`)} />
        <div className="grid grid-cols-6 gap-1">
          {([["left", "⇤"], ["center", "↔"], ["right", "⇥"], ["top", "⤒"], ["middle", "↕"], ["bottom", "⤓"]] as const).map(([a, ic]) => (
            <button key={a} type="button" title={`Alinhar: ${a}`} onClick={() => onAlign(a)} className="cursor-pointer rounded border border-[var(--border)] bg-[var(--surface)] py-1 text-sm hover:bg-[var(--surface-2)]">{ic}</button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button type="button" title={title} onClick={onClick} className={cn("cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] p-1.5 hover:bg-[var(--surface-2)]", danger && "text-red-600 hover:bg-red-50")}>
      {children}
    </button>
  );
}
