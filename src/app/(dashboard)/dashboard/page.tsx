import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {session.user.name || session.user.email}!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Form builder coming in Phase 4.
        </p>
      </div>
    </div>
  );
}
