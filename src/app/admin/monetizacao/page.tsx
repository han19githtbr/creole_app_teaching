"use client";

import { useEffect, useState } from "react";
import {
  Coins,
  Gift,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Award,
  DollarSign,
  Calculator,
  UserCheck,
  UserX,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { IMonetizationPackage, IMonetizationSettings } from "@/models/MonetizationSettings";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isExemptFromBilling?: boolean;
  freeAccessReason?: string;
  availableMinutes?: number;
  bonusStoriesBalance?: number;
  bonusGamesBalance?: number;
  trialExpiresAt?: string;
  trialStoriesUsed?: number;
  trialGamesUsed?: number;
  totalStoriesTimeSeconds?: number;
  totalCquoiTimeSeconds?: number;
  totalStoriesWatched?: number;
  totalCquoiGamesPlayed?: number;
  lastActiveAt?: string;
  createdAt?: string;
}

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    exemptUsersCount: number;
    activeTrialUsersCount: number;
    paidBalanceUsersCount: number;
    totalStoriesHours: string;
    totalCquoiHours: string;
    totalStoriesWatched: number;
    totalCquoiGamesPlayed: number;
  };
  users: AdminUser[];
  settings: IMonetizationSettings;
  serverTime?: number;
}

export default function AdminMonetizationPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "draw" | "users" | "settings" | "packages">("overview");

  // Feedback message
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtros de Usuários
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState<"all" | "trial" | "exempt" | "paid" | "depleted">("all");

  // Estado para Sorteio
  const [drawCount, setDrawCount] = useState<number>(1);
  const [drawReason, setDrawReason] = useState("Sorteio Especial de Boas-Vindas");
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawWinners, setDrawWinners] = useState<Array<{ id: string; name: string; email: string; reason: string }>>([]);

  // Estado para Adicionar Minutos Manualmente
  const [selectedUserForMinutes, setSelectedUserForMinutes] = useState<AdminUser | null>(null);
  const [manualMinutes, setManualMinutes] = useState<number>(60);
  const [manualBonusStories, setManualBonusStories] = useState<number>(2);
  const [addingMinutes, setAddingMinutes] = useState(false);

  // Estado de Edição de Configurações
  const [settingsForm, setSettingsForm] = useState<{
    storyCreditsCost: number;
    minutesPerCredit: number;
    gameCreditsCost: number;
    newStudentTrialDays: number;
    newStudentTrialStories: number;
    newStudentTrialGames: number;
    packages: IMonetizationPackage[];
  } | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const [nowTimestamp, setNowTimestamp] = useState<number>(0);

  // Carrega dados iniciais
  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/monetization", { cache: "no-store" });
      if (res.ok) {
        const json: AdminDashboardData = await res.json();
        setData(json);
        if (json.serverTime) setNowTimestamp(json.serverTime);
        setSettingsForm({
          storyCreditsCost: json.settings.storyCreditsCost || 2,
          minutesPerCredit: json.settings.minutesPerCredit || 2,
          gameCreditsCost: json.settings.gameCreditsCost || 1,
          newStudentTrialDays: json.settings.newStudentTrialDays || 3,
          newStudentTrialStories: json.settings.newStudentTrialStories || 3,
          newStudentTrialGames: json.settings.newStudentTrialGames || 3,
          packages: json.settings.packages || [],
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do admin de monetização:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/monetization", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: AdminDashboardData | null) => {
        if (!ignore && json) {
          setData(json);
          if (json.serverTime) setNowTimestamp(json.serverTime);
          setSettingsForm({
            storyCreditsCost: json.settings.storyCreditsCost || 2,
            minutesPerCredit: json.settings.minutesPerCredit || 2,
            gameCreditsCost: json.settings.gameCreditsCost || 1,
            newStudentTrialDays: json.settings.newStudentTrialDays || 3,
            newStudentTrialStories: json.settings.newStudentTrialStories || 3,
            newStudentTrialGames: json.settings.newStudentTrialGames || 3,
            packages: json.settings.packages || [],
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar dados do admin de monetização:", err);
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Executar Sorteio
  const handleRunDraw = async () => {
    if (drawCount < 1) return;
    setDrawLoading(true);
    setDrawWinners([]);
    try {
      const res = await fetch("/api/admin/monetization/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: drawCount, reason: drawReason }),
      });
      const result = await res.json();
      if (res.ok && result.winners?.length) {
        setDrawWinners(result.winners);
        showFeedback(`${result.winners.length} aluno(s) contemplado(s) com acesso gratuito!`);
        await loadData();
      } else {
        showFeedback(result.message || result.error || "Nenhum aluno elegível encontrado.", "error");
      }
    } catch (err) {
      console.error("Erro ao sortear:", err);
      showFeedback("Falha ao realizar sorteio.", "error");
    } finally {
      setDrawLoading(false);
    }
  };

  // Alternar Isenção Manualmente
  const handleToggleExempt = async (user: AdminUser) => {
    const newExempt = !user.isExemptFromBilling;
    try {
      const res = await fetch("/api/admin/monetization/users/exempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          isExempt: newExempt,
          reason: newExempt ? "Isenção concedida pelo Administrador" : "",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        showFeedback(result.message);
        await loadData();
      } else {
        showFeedback(result.error || "Erro ao alterar isenção.", "error");
      }
    } catch {
      showFeedback("Erro ao conectar ao servidor.", "error");
    }
  };

  // Injetar Minutos Manualmente
  const handleAddMinutes = async () => {
    if (!selectedUserForMinutes) return;
    setAddingMinutes(true);
    try {
      const res = await fetch("/api/admin/monetization/users/add-minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForMinutes._id,
          minutes: manualMinutes,
          bonusStories: manualBonusStories,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        showFeedback(result.message);
        setSelectedUserForMinutes(null);
        await loadData();
      } else {
        showFeedback(result.error || "Erro ao adicionar minutos.", "error");
      }
    } catch {
      showFeedback("Erro ao adicionar minutos.", "error");
    } finally {
      setAddingMinutes(false);
    }
  };

  // Salvar Configurações e Pacotes
  const handleSaveSettings = async () => {
    if (!settingsForm) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/monetization/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const result = await res.json();
      if (res.ok) {
        showFeedback("Configurações e pacotes atualizados com sucesso!");
        await loadData();
      } else {
        showFeedback(result.error || "Erro ao salvar configurações.", "error");
      }
    } catch {
      showFeedback("Erro ao conectar ao servidor.", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtragem de Alunos
  const filteredUsers = (data?.users || []).filter((u) => {
    // Busca
    const q = userSearch.toLowerCase().trim();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    if (!matchSearch) return false;

    // Status
    const trialExp = u.trialExpiresAt ? new Date(u.trialExpiresAt).getTime() : 0;
    const inTrial = nowTimestamp > 0 && trialExp > nowTimestamp && !u.isExemptFromBilling && u.role !== "admin";

    if (userFilter === "exempt") return u.isExemptFromBilling || u.role === "admin";
    if (userFilter === "trial") return inTrial;
    if (userFilter === "paid") return (u.availableMinutes || 0) > 0;
    if (userFilter === "depleted")
      return !inTrial && !u.isExemptFromBilling && u.role !== "admin" && (u.availableMinutes || 0) <= 0;

    return true;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-secondary)]">
        <Clock className="h-5 w-5 animate-spin mr-2 text-amber-500" />
        Carregando painel de monetização e alunos...
      </div>
    );
  }

  const exactStoryMinutes = (settingsForm?.storyCreditsCost || 2) * (settingsForm?.minutesPerCredit || 2);
  const exactGameMinutes = (settingsForm?.gameCreditsCost || 1) * (settingsForm?.minutesPerCredit || 2);

  return (
    <div className="space-y-6">
      {/* Alerta de Feedback Flutuante */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border animate-in fade-in slide-in-from-top-4 ${
            feedback.type === "success"
              ? "bg-emerald-500 text-white border-emerald-400"
              : "bg-red-500 text-white border-red-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
            <Coins className="h-4 w-4" /> Gestão de Monetização & Alunos
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">Controle de Tempo, Pacotes & Degustação</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
            Acompanhe o engajamento dos alunos nas Histórias e no Jogo C&apos;est quoi ?, configure o cálculo exato por unidade, gerencie pacotes de minutos e realize sorteios de gratuidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="gap-1 border-[var(--border)] text-xs text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Atualizar
          </Button>
        </div>
      </header>

      {/* Seletor de Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2 text-xs font-medium">
        {[
          { key: "overview", label: "Visão Geral & Métricas", icon: TrendingUp },
          { key: "draw", label: "Sorteador de Alunos Gratuitos", icon: Award },
          { key: "users", label: `Monitor de Alunos (${data?.users.length || 0})`, icon: Users },
          { key: "settings", label: "Cálculo Exato & Degustação", icon: Calculator },
          { key: "packages", label: "Pacotes de Minutos", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500 text-white font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* ABA 1: VISÃO GERAL & MÉTRICAS                            */}
      {/* ======================================================== */}
      {activeTab === "overview" && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Alunos Totais</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--text)]">{data.stats.totalUsers}</div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">Cadastrados na plataforma</div>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Acesso Gratuito VIP / Isentos</span>
                <Gift className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
                {data.stats.exemptUsersCount}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">Sorteados ou liberados pelo Admin</div>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Em Degustação (3 Dias)</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-amber-500">{data.stats.activeTrialUsersCount}</div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">Novos alunos testando a plataforma</div>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Com Saldo de Minutos</span>
                <Coins className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {data.stats.paidBalanceUsersCount}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">Alunos com saldo recarregado</div>
            </Card>
          </div>

          {/* Métricas de Uso Acumulado das Duas Features Monetizadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text)]">Histórias Vivas Narradas</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Consumo exclusivo das histórias em Francês e Kreyòl
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Tempo Total Ativo:</span>
                  <div className="text-xl font-black text-amber-500">{data.stats.totalStoriesHours} horas</div>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Histórias Assistidas:</span>
                  <div className="text-xl font-black text-[var(--text)]">{data.stats.totalStoriesWatched}</div>
                </div>
              </div>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text)]">Jogo C&apos;est quoi ? & Quiz</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Tempo e rodadas disputadas pelos alunos na arena
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Tempo Total Ativo:</span>
                  <div className="text-xl font-black text-purple-500">{data.stats.totalCquoiHours} horas</div>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Partidas Concluídas:</span>
                  <div className="text-xl font-black text-[var(--text)]">{data.stats.totalCquoiGamesPlayed}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Dica Informativa sobre o Modelo de Cobrança */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-[var(--text)] space-y-1.5">
            <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Regras de Proteção e Cobrança Ativas</span>
            </div>
            <p className="text-[var(--text-secondary)]">
              • <strong>Apenas Histórias e Jogo:</strong> Navegação no painel, lições de gramática e vídeos gerais não debitam minutos.
            </p>
            <p className="text-[var(--text-secondary)]">
              • <strong>Pausa Inteligente:</strong> Se a aba for minimizada ou o aluno ficar mais de 45s sem interagir, a contagem de tempo congela instantaneamente.
            </p>
            <p className="text-[var(--text-secondary)]">
              • <strong>Administrador Totalmente Isento:</strong> Você navega e joga sem nunca ser cobrado.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: SORTEADOR DE ALUNOS GRATUITOS                     */}
      {/* ======================================================== */}
      {activeTab === "draw" && (
        <div className="space-y-6">
          <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text)]">Sortear Alunos para Acesso Gratuito Vitalício</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Escolha a quantidade de alunos que você deseja presentear. O sistema sorteia de forma 100% aleatória entre os usuários cadastrados que ainda não possuem isenção.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text)]">Quantidade de Alunos a Sortear:</label>
                  <select
                    value={drawCount}
                    onChange={(e) => setDrawCount(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 text-sm text-[var(--text)]"
                  >
                    <option value={1}>1 aluno sortudo</option>
                    <option value={2}>2 alunos sortudos</option>
                    <option value={3}>3 alunos sortudos</option>
                    <option value={5}>5 alunos sortudos</option>
                    <option value={10}>10 alunos sortudos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text)]">Motivo do Acesso Gratuito:</label>
                  <Input
                    value={drawReason}
                    onChange={(e) => setDrawReason(e.target.value)}
                    placeholder="Ex: Sorteio Semanal Kreyòl"
                    className="mt-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleRunDraw}
                  disabled={drawLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
                >
                  <Award className="h-4 w-4" />
                  {drawLoading ? "Realizando Sorteio..." : `Sortear ${drawCount} Aluno(s) Agora`}
                </Button>
              </div>
            </div>
          </Card>

          {/* Vencedores Recentes */}
          {drawWinners.length > 0 && (
            <div className="rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 p-5 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <Sparkles className="h-5 w-5" />
                <span>🎉 Alunos Contemplados no Sorteio com Gratuidade Total:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {drawWinners.map((winner) => (
                  <div
                    key={winner.id}
                    className="rounded-xl border border-purple-500/30 bg-[var(--surface)] p-3 text-xs shadow-sm"
                  >
                    <div className="font-bold text-[var(--text)] text-sm">{winner.name}</div>
                    <div className="text-[var(--text-secondary)] truncate">{winner.email}</div>
                    <div className="mt-2 inline-block rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                      {winner.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Alunos Atualmente Isentos */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-500" />
              Alunos que já possuem Acesso Gratuito ({data?.users.filter((u) => u.isExemptFromBilling).length || 0})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data?.users
                .filter((u) => u.isExemptFromBilling && u.role !== "admin")
                .map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-[var(--text)] truncate">{u.name}</div>
                      <div className="text-[var(--text-secondary)] text-[11px] truncate">{u.email}</div>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                        {u.freeAccessReason || "Acesso VIP"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleExempt(u)}
                      className="h-7 text-[11px] text-red-500 hover:text-red-600 border-red-200"
                    >
                      Remover
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: MONITOR DE ALUNOS                                 */}
      {/* ======================================================== */}
      {activeTab === "users" && data && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-xs">
              {[
                { key: "all", label: "Todos" },
                { key: "trial", label: "Degustação (3 Dias)" },
                { key: "paid", label: "Com Saldo" },
                { key: "exempt", label: "Acesso Gratuito VIP" },
                { key: "depleted", label: "Sem Saldo" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setUserFilter(f.key as typeof userFilter)}
                  className={`rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer ${
                    userFilter === f.key
                      ? "bg-[var(--accent)] text-white font-bold"
                      : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela de Alunos */}
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Aluno</th>
                  <th className="p-3">Status de Cobrança</th>
                  <th className="p-3">Histórias (Tempo/Vistas)</th>
                  <th className="p-3">Jogo (Tempo/Partidas)</th>
                  <th className="p-3">Última Atividade</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--text-secondary)]">
                      Nenhum aluno encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === "admin";
                    const isExempt = Boolean(u.isExemptFromBilling || isAdmin);
                    const trialExp = u.trialExpiresAt ? new Date(u.trialExpiresAt).getTime() : 0;
                    const inTrial = nowTimestamp > 0 && trialExp > nowTimestamp && !isExempt;
                    const daysLeft = inTrial ? Math.ceil((trialExp - nowTimestamp) / (24 * 60 * 60 * 1000)) : 0;

                    const storiesMins = Math.round((u.totalStoriesTimeSeconds || 0) / 60);
                    const gameMins = Math.round((u.totalCquoiTimeSeconds || 0) / 60);

                    return (
                      <tr key={u._id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                        {/* Aluno */}
                        <td className="p-3">
                          <div className="font-semibold text-[var(--text)]">{u.name}</div>
                          <div className="text-[11px] text-[var(--text-secondary)] truncate max-w-[200px]">
                            {u.email}
                          </div>
                        </td>

                        {/* Status de Cobrança */}
                        <td className="p-3">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck className="h-3 w-3" /> Admin (Ilimitado)
                            </span>
                          ) : isExempt ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                              <Gift className="h-3 w-3" /> Acesso Gratuito VIP
                            </span>
                          ) : inTrial ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Clock className="h-3 w-3" /> Degustação ({daysLeft}d restantes)
                            </span>
                          ) : (u.availableMinutes || 0) > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              <Coins className="h-3 w-3" /> {Math.floor(u.availableMinutes || 0)} min saldo
                              {(u.bonusStoriesBalance || 0) > 0 && ` (+${u.bonusStoriesBalance} bônus)`}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-500/10 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                              Esgotado / Sem saldo
                            </span>
                          )}
                        </td>

                        {/* Histórias */}
                        <td className="p-3">
                          <div className="font-semibold text-[var(--text)]">{storiesMins} min ativos</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">
                            {u.totalStoriesWatched || 0} histórias assistidas
                          </div>
                        </td>

                        {/* Jogo C'est quoi ? */}
                        <td className="p-3">
                          <div className="font-semibold text-[var(--text)]">{gameMins} min ativos</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">
                            {u.totalCquoiGamesPlayed || 0} jogos jogados
                          </div>
                        </td>

                        {/* Última Atividade */}
                        <td className="p-3 text-[11px] text-[var(--text-secondary)]">
                          {u.lastActiveAt
                            ? new Date(u.lastActiveAt).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Ainda não ativo"}
                        </td>

                        {/* Ações */}
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {!isAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleExempt(u)}
                                className={`h-7 text-[11px] font-semibold ${
                                  u.isExemptFromBilling
                                    ? "text-red-500 hover:text-red-600 border-red-200"
                                    : "text-purple-600 dark:text-purple-400 border-purple-200 hover:bg-purple-50"
                                }`}
                              >
                                {u.isExemptFromBilling ? <UserX className="h-3 w-3 mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
                                {u.isExemptFromBilling ? "Revogar VIP" : "Dar Acesso Grátis"}
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUserForMinutes(u)}
                                className="h-7 text-[11px] text-amber-600 dark:text-amber-400 border-amber-200 hover:bg-amber-50"
                              >
                                <PlusCircle className="h-3 w-3 mr-1" /> + Minutos
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Minutos Manualmente */}
      {selectedUserForMinutes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              Adicionar Minutos & Bônus
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Injetar minutos de aprendizado para <strong>{selectedUserForMinutes.name}</strong> ({selectedUserForMinutes.email}).
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Minutos a Adicionar:</label>
                <Input
                  type="number"
                  min={1}
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Histórias Bônus a Adicionar:</label>
                <Input
                  type="number"
                  min={0}
                  value={manualBonusStories}
                  onChange={(e) => setManualBonusStories(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                onClick={handleAddMinutes}
                disabled={addingMinutes}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                {addingMinutes ? "Adicionando..." : "Confirmar e Injetar"}
              </Button>
              <Button variant="ghost" onClick={() => setSelectedUserForMinutes(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 4: CÁLCULO EXATO & DEGUSTAÇÃO                        */}
      {/* ======================================================== */}
      {activeTab === "settings" && settingsForm && (
        <div className="space-y-6">
          {/* Card com Calculadora de Métricas Combinadas */}
          <Card className="border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">Cálculo Exato da Unidade de Conteúdo</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Defina o custo em créditos e a equivalência de tempo por crédito para obter o cálculo exato por unidade de conteúdo.
                </p>
              </div>
            </div>

            {/* Painel do Cálculo Matemático Exato */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Fórmula de Conversão Exata em Execução:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[var(--surface)] p-3 border border-[var(--border)]">
                  <div className="text-xs text-[var(--text-secondary)]">Custo de 1 História Narrada:</div>
                  <div className="font-bold text-base text-[var(--text)] mt-1">
                    {settingsForm.storyCreditsCost} créditos × {settingsForm.minutesPerCredit} min ={" "}
                    <span className="text-amber-500">{exactStoryMinutes} minutos exatos da cota</span>
                  </div>
                </div>

                <div className="rounded-lg bg-[var(--surface)] p-3 border border-[var(--border)]">
                  <div className="text-xs text-[var(--text-secondary)]">Custo de 1 Partida do Jogo C&apos;est quoi ?:</div>
                  <div className="font-bold text-base text-[var(--text)] mt-1">
                    {settingsForm.gameCreditsCost} créditos × {settingsForm.minutesPerCredit} min ={" "}
                    <span className="text-purple-500">{exactGameMinutes} minutos exatos da cota</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs de Configuração */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Créditos por História:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.storyCreditsCost}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, storyCreditsCost: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-[var(--text-muted)]">Padrão: 2 créditos</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Minutos por Crédito:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.minutesPerCredit}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, minutesPerCredit: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-[var(--text-muted)]">Padrão: 2 minutos (2 × 2 = 4 min)</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Créditos por Jogo:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.gameCreditsCost}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, gameCreditsCost: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-[var(--text-muted)]">Padrão: 1 crédito (1 × 2 = 2 min)</span>
              </div>
            </div>
          </Card>

          {/* Card com Regras de Degustação para o Novo Aluno */}
          <Card className="border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">Degustação para Aluno Novo (Boas-Vindas)</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Configuração dos dias de acesso gratuito e franquia inicial de histórias e jogos concedida automaticamente aos novos cadastrados.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Dias de Degustação Gratuita:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.newStudentTrialDays}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, newStudentTrialDays: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  3 dias de acesso grátis a partir do cadastro
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Histórias Grátis no Período:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.newStudentTrialStories}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, newStudentTrialStories: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-[var(--text-muted)]">Cota de degustação de histórias</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Jogos Grátis no Período:</label>
                <Input
                  type="number"
                  min={1}
                  value={settingsForm.newStudentTrialGames}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, newStudentTrialGames: Math.max(1, Number(e.target.value)) })
                  }
                  className="mt-1"
                />
                <span className="text-[11px] text-[var(--text-muted)]">Cota de degustação no jogo C&apos;est quoi ?</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 px-6"
            >
              <Save className="h-4 w-4" />
              {savingSettings ? "Salvando..." : "Salvar Configurações de Métricas & Degustação"}
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 5: GERENCIADOR DE PACOTES DE MINUTOS                */}
      {/* ======================================================== */}
      {activeTab === "packages" && settingsForm && (
        <div className="space-y-6">
          <Card className="border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Pacotes de Minutos (PIX & Cartão)
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Aumente ou diminua os minutos de cada pacote, altere preços e defina bônus exclusivos de histórias.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  const newPkg: IMonetizationPackage = {
                    id: `pkg_${Date.now()}`,
                    name: "Novo Pacote",
                    priceBRL: 20,
                    minutes: 180,
                    bonusStories: 3,
                    isPopular: false,
                  };
                  setSettingsForm({
                    ...settingsForm,
                    packages: [...settingsForm.packages, newPkg],
                  });
                }}
                className="gap-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar Pacote
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {settingsForm.packages.map((pkg, idx) => (
                <div
                  key={pkg.id || idx}
                  className={`rounded-2xl border-2 p-4 bg-[var(--surface-2)] space-y-3 relative ${
                    pkg.isPopular ? "border-amber-500" : "border-[var(--border)]"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Mais Popular
                    </span>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Input
                      value={pkg.name}
                      onChange={(e) => {
                        const next = [...settingsForm.packages];
                        next[idx].name = e.target.value;
                        setSettingsForm({ ...settingsForm, packages: next });
                      }}
                      className="font-bold text-sm bg-[var(--surface)]"
                    />

                    <button
                      onClick={() => {
                        const next = settingsForm.packages.filter((_, i) => i !== idx);
                        setSettingsForm({ ...settingsForm, packages: next });
                      }}
                      className="p-1 text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                      title="Excluir pacote"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-[var(--text-secondary)]">Preço (R$):</label>
                      <Input
                        type="number"
                        min={1}
                        step={0.5}
                        value={pkg.priceBRL}
                        onChange={(e) => {
                          const next = [...settingsForm.packages];
                          next[idx].priceBRL = Number(e.target.value);
                          setSettingsForm({ ...settingsForm, packages: next });
                        }}
                        className="mt-1 bg-[var(--surface)]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[var(--text-secondary)]">Minutos de Uso:</label>
                      <Input
                        type="number"
                        min={10}
                        step={10}
                        value={pkg.minutes}
                        onChange={(e) => {
                          const next = [...settingsForm.packages];
                          next[idx].minutes = Number(e.target.value);
                          setSettingsForm({ ...settingsForm, packages: next });
                        }}
                        className="mt-1 bg-[var(--surface)] font-bold text-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-secondary)]">Histórias Bônus:</label>
                    <Input
                      type="number"
                      min={0}
                      value={pkg.bonusStories}
                      onChange={(e) => {
                        const next = [...settingsForm.packages];
                        next[idx].bonusStories = Number(e.target.value);
                        setSettingsForm({ ...settingsForm, packages: next });
                      }}
                      className="mt-1 bg-[var(--surface)]"
                    />
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`pop_${pkg.id}`}
                      checked={Boolean(pkg.isPopular)}
                      onChange={(e) => {
                        const next = settingsForm.packages.map((p, i) => ({
                          ...p,
                          isPopular: i === idx ? e.target.checked : false,
                        }));
                        setSettingsForm({ ...settingsForm, packages: next });
                      }}
                      className="rounded border-[var(--border)] text-amber-500 focus:ring-amber-400"
                    />
                    <label htmlFor={`pop_${pkg.id}`} className="text-xs text-[var(--text)] cursor-pointer">
                      Destacar como &quot;Mais Popular&quot;
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 px-6"
            >
              <Save className="h-4 w-4" />
              {savingSettings ? "Salvando..." : "Salvar Pacotes de Minutos"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
