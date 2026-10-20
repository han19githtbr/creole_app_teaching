import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getPrimaryAdminEmail } from "@/lib/adminAccess";
import CoAdmin from "@/models/CoAdmin";
import User from "@/models/User";
import { AdminManager, type AdminListItem } from "@/components/AdminManager";
import { MAX_CO_ADMINS } from "@/lib/adminAccess";

export const dynamic = "force-dynamic";

export default async function AdministradoresPage() {
  const session = await getServerSession(authOptions);
  const canManage = Boolean(session?.user?.isPrimaryAdmin);

  await connectDB();
  const coAdmins = await CoAdmin.find().sort({ createdAt: 1 }).lean();
  const primaryEmail = getPrimaryAdminEmail();
  const emails = [primaryEmail, ...coAdmins.map((a) => a.email)].filter(Boolean);
  const users = await User.find({ email: { $in: emails } })
    .select("email name image")
    .lean();
  const byEmail = new Map(users.map((u) => [u.email, u]));

  const primary: AdminListItem | null = primaryEmail
    ? {
        email: primaryEmail,
        name: byEmail.get(primaryEmail)?.name ?? null,
        image: byEmail.get(primaryEmail)?.image ?? null,
      }
    : null;

  const admins: AdminListItem[] = coAdmins.map((a) => ({
    email: a.email,
    name: byEmail.get(a.email)?.name ?? null,
    image: byEmail.get(a.email)?.image ?? null,
    addedByEmail: a.addedByEmail,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : undefined,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Administradores</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Quem pode gerenciar o conteúdo da plataforma. O administrador principal tem o maior
          privilégio e é o único que adiciona ou remove administradores.
        </p>
      </div>
      <AdminManager primary={primary} admins={admins} max={MAX_CO_ADMINS} canManage={canManage} />
    </div>
  );
}
