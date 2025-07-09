"use client";

import { useState } from "react";
import { ConnectionList } from "@/components/connection-list";
import { ConnectionDialog } from "@/components/connection-dialog";
import { useConnections } from "./context";
import { Connection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Home() {
  const {
    connections,
    addConnection,
    updateConnection,
    deleteConnection,
    loading,
  } = useConnections();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConnection, setEditingConnection] = useState<
    Connection | undefined
  >(undefined);

  const handleSaveConnection = (connection: Connection) => {
    if (editingConnection) {
      updateConnection(connection);
      setEditingConnection(undefined);
    } else {
      addConnection(connection);
    }
    setOpenDialog(false);
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setOpenDialog(true);
  };

  const handleDeleteConnection = (connection: Connection) => {
    if (
      confirm(
        `Are you sure you want to delete the connection "${connection.name}"?`
      )
    ) {
      deleteConnection(connection.id);
    }
  };

  const handleOpenNewConnectionDialog = () => {
    setEditingConnection(undefined);
    setOpenDialog(true);
  };

  return (
    <main className="w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] h-screen flex justify-center items-center flex-col mx-auto pb-20">
      <div className="my-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-primary">
          Pico PG
        </h1>

        <p className="text-sm text-muted-foreground">
          A simple, lightweight, local-only, and open source Postgres client.
        </p>
      </div>
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading connections...
        </div>
      ) : (
        <ConnectionList
          connections={connections}
          onEdit={handleEditConnection}
          onDelete={handleDeleteConnection}
        />
      )}

      <Button variant="outline" onClick={handleOpenNewConnectionDialog}>
        <PlusIcon className="h-4 w-4" />
        Add connection
      </Button>

      <ConnectionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        connection={editingConnection}
        onSave={handleSaveConnection}
      />

      <footer className="fixed bottom-6 left-8">
        <p className="text-balance text-center text-xs leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/NikSchaefer"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 font-medium"
          >
            Nik Schaefer
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/NikSchaefer/pico-pg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 font-medium"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
