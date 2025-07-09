"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyConnections } from "@/components/empty-connections";
import { ConnectionList } from "@/components/connection-list";
import { ConnectionDialog } from "@/components/connection-dialog";
import { useConnections } from "./context";
import { Connection } from "@/lib/types";

export default function Home() {
  const { connections, addConnection, loading } = useConnections();
  const [openDialog, setOpenDialog] = useState(false);

  const handleSaveConnection = (connection: Connection) => {
    addConnection(connection);
    setOpenDialog(false);
  };

  return (
    <main className="w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] h-screen flex justify-center items-center flex-col mx-auto pb-20">
      <div className="my-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-primary">
          Pico PG
        </h1>

        <p className="text-sm text-muted-foreground">
          A simple PostgreSQL client.{" "}
          <Button variant="ghost" className="font-normal p-0 w-fit text-sm">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>{" "}
          to get started
        </p>
      </div>
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading connections...
        </div>
      ) : connections.length > 0 ? (
        <ConnectionList connections={connections} />
      ) : (
        <EmptyConnections onAddConnection={() => setOpenDialog(true)} />
      )}
      <ConnectionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
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
