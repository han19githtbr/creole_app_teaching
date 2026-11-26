export interface LocalizedText {
  fr: string;
  kreyol: string;
  pt: string;
}

export interface StoryScriptItem {
  /** Identificador único do roteiro (ex.: "tecnologia-01"). */
  id: string;
  /** Tema exatamente como definido em IMAGE_THEMES (src/lib/imageBank.ts). */
  theme: string;
  /** ID da cena sugerida no banco de imagens (IMAGE_BANK). */
  suggestedSceneId: string;
  /** Duração estimada da leitura em voz alta, em segundos (até 120 s). */
  estimatedSeconds: number;
  /** Elementos da cena citados no texto para ativar animações do motor de vida. */
  elementsCited: string[];
  /** Título da curiosidade nos idiomas da plataforma + apoio em português. */
  title: LocalizedText;
  /** Breve descrição/apresentação em português (para o formulário da curiosidade). */
  summaryPt: string;
  /** Texto completo para gravação/leitura em Francês. */
  fr: string;
  /** Texto completo para gravação/leitura em Kreyòl Ayisyen. */
  kreyol: string;
  /** Tradução de apoio em Português (Brasil). */
  pt: string;
}
