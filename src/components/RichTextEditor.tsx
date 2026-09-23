"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

export function RichTextEditor({
  value,
  onChange,
  rows = 16,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="rounded-lg border border-[#d6d3d1] bg-white">
      <div className="flex items-center gap-1 border-b border-[#f0efed] p-1.5">
        <Button
          type="button"
          size="sm"
          variant={mode === "edit" ? "primary" : "ghost"}
          onClick={() => setMode("edit")}
        >
          <Pencil className="h-3.5 w-3.5" /> Editar
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "preview" ? "primary" : "ghost"}
          onClick={() => setMode("preview")}
        >
          <Eye className="h-3.5 w-3.5" /> Pré-visualizar
        </Button>
        <span className="ml-auto pr-2 text-xs text-[#a8a29e]">Markdown suportado</span>
      </div>
      {mode === "edit" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="rounded-none border-0 focus:ring-0"
        />
      ) : (
        <div className="max-h-[32rem] overflow-y-auto p-4">
          <Markdown content={value || "*Nada para pré-visualizar ainda.*"} />
        </div>
      )}
    </div>
  );
}
