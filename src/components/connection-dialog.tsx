"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConnectionForm } from "@/components/connection-form";
import { Connection } from "@/lib/types";
import { toast } from "sonner";

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection?: Connection;
  onSave: (connection: Connection) => void;
}

export function ConnectionDialog({
  open,
  onOpenChange,
  connection,
  onSave,
}: ConnectionDialogProps) {
  const isEditing = !!connection;

  const handleSave = (connection: Connection) => {
    try {
      onSave(connection);
      onOpenChange(false);
      toast.success(
        isEditing
          ? "Connection updated successfully"
          : "Connection created successfully"
      );
    } catch (error) {
      toast.error("Failed to save connection");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-slate-200">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {isEditing ? "Edit Connection" : "New Connection"}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {isEditing
              ? "Update your database connection details."
              : "Enter your PostgreSQL database connection details."}
          </DialogDescription>
        </DialogHeader>

        <ConnectionForm
          connection={connection}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
