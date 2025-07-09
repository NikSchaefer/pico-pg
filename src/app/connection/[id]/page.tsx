"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConnection } from "@/lib/storage";
import { Connection, Table } from "@/lib/types";
import { toast } from "sonner";
import { useTables, useQuery } from "@/lib/hooks";
import { Loader2, ArrowLeft } from "lucide-react";
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
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          <p className="text-sm text-slate-500">Loading connection...</p>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-600">Connection not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to connections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-grow h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar
          connection={connection}
          tables={filteredTables}
          tablesLoading={tablesLoading}
          selectedTable={selectedTable}
          onTableSelect={handleTableSelect}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <QueryToolbar
            selectedTable={selectedTable}
            onRunQuery={handleQueryExecution}
            isLoading={queryLoading}
            queryEmpty={!query.trim()}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <SqlEditor query={query} setQuery={setQuery} />

            {error && <QueryErrorMessage error={error} />}

            <div className="flex-grow overflow-x-auto overflow-y-auto">
              {result ? (
                <QueryResults result={result} />
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-slate-400">
                  <div className="text-center space-y-2">
                    <p className="text-sm">Run a query to see results</p>
                    <p className="text-xs">
                      Select a table from the sidebar or write your own SQL
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
