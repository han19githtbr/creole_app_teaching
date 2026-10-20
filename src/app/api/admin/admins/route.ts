import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requirePrimaryAdmin } from "@/lib/apiAuth";
import {
  MAX_CO_ADMINS,
  getPrimaryAdminEmail,
  invalidateAdminCache,
  isPrimaryAdminEmail,
  isValidEmail,
  normalizeEmail,
  syncUserRole,
} from "@/lib/adminAccess";
import CoAdmin from "@/models/CoAdmin";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const FORBIDDEN_PRIMARY_ONLY = {
  error: "Somente o administrador principal pode adicionar ou remover administradores.",
};

/** Lista os administradores. Qualquer administrador pode consultar. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  await connectDB();
  const coAdmins = await CoAdmin.find().sort({ createdAt: 1 }).lean();
  const primaryEmail = getPrimaryAdminEmail();
  const emails = [primaryEmail, ...coAdmins.map((a) => a.email)].filter(Boolean);
  const users = await User.find({ email: { $in: emails } })
    .select("email name image")
    .lean();
  const byEmail = new Map(users.map((u) => [u.email, u]));

  return NextResponse.json({
    primary: primaryEmail
      ? {
          email: primaryEmail,
          name: byEmail.get(primaryEmail)?.name ?? null,
          image: byEmail.get(primaryEmail)?.image ?? null,
        }
      : null,
    admins: coAdmins.map((a) => ({
      email: a.email,
      name: byEmail.get(a.email)?.name ?? null,
      image: byEmail.get(a.email)?.image ?? null,
      addedByEmail: a.addedByEmail,
      createdAt: a.createdAt,
    })),
    max: MAX_CO_ADMINS,
  });
}

/** Adiciona um administrador pelo e-mail. Somente o administrador principal. */
export async function POST(req: Request) {
  const session = await requirePrimaryAdmin();
  if (!session) return NextResponse.json(FORBIDDEN_PRIMARY_ONLY, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body?.email);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  if (isPrimaryAdminEmail(email)) {
    return NextResponse.json(
      { error: "Este e-mail já é o do administrador principal." },
      { status: 400 }
    );
  }

  await connectDB();
  if (await CoAdmin.exists({ email })) {
    return NextResponse.json({ error: "Este e-mail já é administrador." }, { status: 409 });
  }
  if ((await CoAdmin.countDocuments()) >= MAX_CO_ADMINS) {
    return NextResponse.json(
      { error: `Limite de ${MAX_CO_ADMINS} administradores adicionais atingido.` },
      { status: 400 }
    );
  }

  const created = await CoAdmin.create({
    email,
    addedByEmail: normalizeEmail(session.user.email),
  });
  invalidateAdminCache();
  // Se a pessoa já tem conta, o papel muda agora; se não, vale no primeiro login.
  await syncUserRole(email, true);

  return NextResponse.json({ ok: true, email: created.email }, { status: 201 });
}

/** Remove um administrador (?email=...). Somente o administrador principal. */
export async function DELETE(req: Request) {
  const session = await requirePrimaryAdmin();
  if (!session) return NextResponse.json(FORBIDDEN_PRIMARY_ONLY, { status: 403 });

  const email = normalizeEmail(new URL(req.url).searchParams.get("email"));
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  if (isPrimaryAdminEmail(email)) {
    return NextResponse.json(
      { error: "O administrador principal não pode ser removido." },
      { status: 400 }
    );
  }

  await connectDB();
  const removed = await CoAdmin.findOneAndDelete({ email });
  if (!removed) {
    return NextResponse.json({ error: "Administrador não encontrado." }, { status: 404 });
  }
  invalidateAdminCache();
  await syncUserRole(email, false);

  return NextResponse.json({ ok: true });
}
