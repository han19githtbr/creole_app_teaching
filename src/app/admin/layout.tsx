import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { connectDB } from "@/lib/mongodb";
import PostAnswer from "@/models/PostAnswer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.role !== "admin") redirect("/dashboard");

  await connectDB();
  const pendingAnswers = await PostAnswer.countDocuments({ status: "pending" });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
      <AdminSidebar pendingAnswers={pendingAnswers} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
