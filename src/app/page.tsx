"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyConnections } from "@/components/empty-connections";
import { ConnectionList } from "@/components/connection-list";
import { PageHeader } from "@/components/page-header";
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
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader />

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Database Connections</CardTitle>
            <Button size="sm" onClick={() => setOpenDialog(true)}>
              New Connection
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading connections...
              </div>
            ) : connections.length > 0 ? (
              <ConnectionList connections={connections} />
            ) : (
              <EmptyConnections onAddConnection={() => setOpenDialog(true)} />
            )}
          </CardContent>
        </Card>
      </div>

      <ConnectionDialog 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
        onSave={handleSaveConnection} 
      />
    </main>
  );
}
