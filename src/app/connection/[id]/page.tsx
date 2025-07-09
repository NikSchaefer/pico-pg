"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConnection } from "@/lib/storage";
import { Connection, Table } from "@/lib/types";
import { toast } from "sonner";
import { useTables, useQuery } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SqlEditor from "@/components/connection/sql-editor";
import QueryToolbar from "@/components/connection/query-toolbar";
import QueryErrorMessage from "@/components/connection/error-message";
import { QueryResults } from "@/components/query-results";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/connection/app-sidebar";

export default function ConnectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Query execution
  const { isLoading: queryLoading, result, error, runQuery } = useQuery();

  // Tables list
  const { tables, isLoading: tablesLoading } = useTables(connection);

  const filteredTables = tables.filter((table) => table.name);

  useEffect(() => {
    const loadConnection = async () => {
      if (!params) return;

      try {
        const { id } = await params;
        const conn = getConnection(id);
        if (conn) {
          setConnection(conn);
          setQuery("-- Select a table or write your query\nSELECT * FROM ");
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

  const handleQueryExecution = async () => {
    if (!connection || !query.trim()) return;
    await runQuery(connection, query);
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    const schemaPrefix = table.schema !== "public" ? `${table.schema}.` : "";
    const newQuery = `SELECT * FROM "${schemaPrefix}${table.name}" LIMIT 100`;
    setQuery(newQuery);
    runQuery(connection!, newQuery);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <p className="text-xl">Connection not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back to connections
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        connection={connection}
        tables={filteredTables}
        tablesLoading={tablesLoading}
        selectedTable={selectedTable}
        onTableSelect={handleTableSelect}
      />
      <main className="flex-grow h-screen overflow-hidden">
        <div className="flex-1 flex h-full flex-col overflow-hidden w-full">
          <QueryToolbar
            selectedTable={selectedTable}
            onRunQuery={handleQueryExecution}
            isLoading={queryLoading}
            queryEmpty={!query.trim()}
          />

          <SqlEditor query={query} setQuery={setQuery} />

          {error && <QueryErrorMessage error={error} />}

          {result ? (
            <QueryResults result={result} />
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-slate-500">
              Run a query to see results
            </div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}
