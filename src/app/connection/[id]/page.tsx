"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConnection } from "@/lib/storage";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableBrowser } from "@/components/table-browser";
import { QueryEditor } from "@/components/query-editor";
import { ArrowLeft, Database } from "lucide-react";
import { Connection } from "@/lib/types";
import { toast } from "sonner";

export default function ConnectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConnection = async () => {
      if (!params) return;

      try {
        const { id } = await params;
        const conn = getConnection(id);
        if (conn) {
          setConnection(conn);
        } else {
          toast.error("Connection not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load connection:", error);
        toast.error("Failed to load connection");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    loadConnection();
  }, [params, router]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PageHeader />
        <div className="mt-8 text-center">Loading connection...</div>
      </main>
    );
  }

  if (!connection) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PageHeader />
        <div className="mt-8 text-center">Connection not found.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to connections
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Database className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">{connection.name}</h1>
          <p className="text-sm text-muted-foreground">
            {connection.host}:{connection.port} / {connection.database}
          </p>
        </div>
      </div>

      <Tabs defaultValue="browser" className="mt-6">
        <TabsList>
          <TabsTrigger value="browser">Database Browser</TabsTrigger>
          <TabsTrigger value="query">SQL Query</TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <TableBrowser connection={connection} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <QueryEditor connection={connection} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
