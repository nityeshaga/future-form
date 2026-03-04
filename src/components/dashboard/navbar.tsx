"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, LogOut, User } from "lucide-react";

interface NavbarProps {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const router = useRouter();

  async function handleCreateForm() {
    const res = await fetch("/api/forms", { method: "POST" });
    if (res.ok) {
      const { form } = await res.json();
      router.push(`/forms/${form.id}/edit`);
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xl font-bold text-primary"
        >
          FutureForm
        </button>

        <div className="flex items-center gap-3">
          <Button onClick={handleCreateForm} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Form
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{userName || userEmail}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
