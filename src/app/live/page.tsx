import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LiveClient } from "./LiveClient";

export default async function LivePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <LiveClient isAdmin={session.user.role === "admin"} />
    </div>
  );
}
