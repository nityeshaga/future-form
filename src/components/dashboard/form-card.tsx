"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, Pencil, BarChart3, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FormCardProps {
  form: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    updatedAt: string;
    _count: { questions: number; responses: number };
  };
  onDelete: (formId: string) => void;
}

export default function FormCard({ form, onDelete }: FormCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColor = {
    draft: "secondary",
    published: "default",
    closed: "destructive",
  } as const;

  async function handleDelete() {
    setIsDeleting(true);
    const res = await fetch(`/api/forms/${form.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (res.ok) {
      setShowDeleteDialog(false);
      onDelete(form.id);
      toast.success("Form deleted");
    } else {
      toast.error("Failed to delete form");
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/f/${form.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Form link copied to clipboard");
  }

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => router.push(`/forms/${form.id}/edit`)}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex-1 pr-2">
            <CardTitle className="line-clamp-1 text-base">{form.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusColor[form.status as keyof typeof statusColor] || "secondary"}>
              {form.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => router.push(`/forms/${form.id}/edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/forms/${form.id}/responses`)}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Responses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {form.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {form.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <span>{form._count.questions} questions</span>
          <span className="mx-2">·</span>
          <span>{form._count.responses} responses</span>
          <span className="mx-2">·</span>
          <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
        </CardFooter>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{form.title}&quot;? This will also
              delete all questions and responses. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
