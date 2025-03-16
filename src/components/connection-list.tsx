import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Database, Edit, Trash2 } from "lucide-react";

import { Connection } from "@/lib/types";
import { ConnectionDialog } from "./connection-dialog";
import { useConnections } from "@/app/context";
import Link from "next/link";

interface ConnectionListProps {
  connections: Connection[];
}

export function ConnectionList({ connections }: ConnectionListProps) {
  const { updateConnection, deleteConnection } = useConnections();
  const [editingConnection, setEditingConnection] = useState<
    Connection | undefined
  >(undefined);
  const [deletingConnectionId, setDeletingConnectionId] = useState<
    string | null
  >(null);

  const handleEdit = (connection: Connection) => {
    setEditingConnection(connection);
  };

  const handleDelete = (id: string) => {
    setDeletingConnectionId(id);
  };

  const confirmDelete = () => {
    if (deletingConnectionId) {
      deleteConnection(deletingConnectionId);
      setDeletingConnectionId(null);
    }
  };

  const handleUpdateConnection = (connection: Connection) => {
    updateConnection(connection);
    setEditingConnection(undefined);
  };

  return (
    <>
      <div className="flex flex-col flex-wrap mx-auto max-w-6xl">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="group max-w-sm w-full bg-card border rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden flex flex-col h-full"
          >
            <Link
              href={`/connection/${connection.id}`}
              className="p-3 cursor-pointer flex-grow"
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-primary" />
                <h3 className="font-medium">{connection.name}</h3>
              </div>

              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div>{connection.database}</div>
                <div>{connection.host}</div>
                {connection.id === "added-recently" && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px]">
                    New
                  </span>
                )}
              </div>
            </Link>

            <div className="border-t p-1 bg-muted/20 flex items-center justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                title="Edit"
                onClick={() => handleEdit(connection)}
                className="h-7 w-7"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                title="Delete"
                onClick={() => handleDelete(connection.id)}
                className="h-7 w-7"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Connection Dialog */}
      {editingConnection && (
        <ConnectionDialog
          open={!!editingConnection}
          onOpenChange={(open) => !open && setEditingConnection(undefined)}
          connection={editingConnection}
          onSave={handleUpdateConnection}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingConnectionId}
        onOpenChange={(open) => !open && setDeletingConnectionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connection? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
