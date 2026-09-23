import { AdminLiveControl } from "./AdminLiveControl";

export default function AdminLivePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text)]">Painel de live</h1>
      <AdminLiveControl />
    </div>
  );
}
