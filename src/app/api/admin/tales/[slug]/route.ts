import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/apiAuth";
import { getTale } from "@/lib/tales/tales";
import TaleSetting from "@/models/TaleSetting";

export const dynamic = "force-dynamic";

/** Publica ou esconde um conto: { "published": true | false }. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });

  const { slug } = await params;
  if (!getTale(slug)) return NextResponse.json({ error: "Conto não encontrado." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  if (typeof body?.published !== "boolean") {
    return NextResponse.json({ error: "Informe se o conto deve ficar publicado (true ou false)." }, { status: 400 });
  }

  await connectDB();
  const setting = await TaleSetting.findOneAndUpdate(
    { slug },
    {
      $set: {
        isPublished: body.published,
        updatedByEmail: session.user.email?.toLowerCase() ?? "",
        ...(body.published ? { publishedAt: new Date() } : {}),
      },
    },
    { upsert: true, new: true }
  );
  return NextResponse.json({
    slug,
    published: setting.isPublished,
    publishedAt: setting.publishedAt ? new Date(setting.publishedAt).toISOString() : null,
  });
}
