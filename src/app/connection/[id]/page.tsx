"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

// Custom SQL syntax highlighting theme similar to the screenshot
const sqlTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#24292e",
    caret: "#24292e",
    selection: "#c8c8fa",
    selectionMatch: "#c8c8fa",
    lineHighlight: "#f0f0f0",
  },
  styles: [
    { tag: tags.keyword, color: "#0000ff" }, // SELECT, FROM, WHERE
    { tag: tags.operator, color: "#24292e" }, // =, >, <
    { tag: tags.string, color: "#008000" }, // String literals
    { tag: tags.comment, color: "#808080", fontStyle: "italic" }, // Comments
    { tag: tags.number, color: "#005cc5" }, // Numbers
    { tag: tags.variableName, color: "#24292e" }, // Column names
    { tag: tags.typeName, color: "#6f42c1" }, // Data types
    { tag: tags.function(tags.variableName), color: "#6f42c1" }, // Functions
    { tag: tags.propertyName, color: "#24292e" }, // Properties
    { tag: tags.definition(tags.propertyName), color: "#953800" }, // Table names
  ],
});
import { useRouter } from "next/navigation";
import { getConnection } from "@/lib/storage";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Play, Loader2, RefreshCw } from "lucide-react";
import { Connection, Table } from "@/lib/types";
import { toast } from "sonner";
import { useTables, useQuery } from "@/lib/hooks";
import { QueryResults } from "@/components/query-results";
import { Card, CardContent } from "@/components/ui/card";

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
  const {
    tables,
    isLoading: tablesLoading,
    refetchTables,
  } = useTables(connection);

  useEffect(() => {
    const loadConnection = async () => {
      if (!params) return;

      try {
        const { id } = await params;
        const conn = getConnection(id);
        if (conn) {
          setConnection(conn);
          // Set initial query to select all from a popular table
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
    setQuery(`SELECT * FROM "${schemaPrefix}${table.name}" LIMIT 100`);
    runQuery(
      connection!,
      `SELECT * FROM "${schemaPrefix}${table.name}" LIMIT 100`,
    );
  };

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

      <div className="grid grid-cols-12 gap-6">
        {/* Tables list */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardContent>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Tables</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refetchTables}
                  disabled={tablesLoading}
                >
                  {tablesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {tablesLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : tables.length > 0 ? (
                  <ul className="space-y-1">
                    {tables.map((table) => (
                      <li key={`${table.schema}.${table.name}`}>
                        <Button
                          variant={
                            selectedTable?.name === table.name
                              ? "secondary"
                              : "ghost"
                          }
                          className="w-full justify-start text-sm h-8"
                          size="sm"
                          onClick={() => handleTableSelect(table)}
                        >
                          <span className="truncate">
                            {table.schema !== "public"
                              ? `${table.schema}.${table.name}`
                              : table.name}
                          </span>
                          {table.rowCount !== undefined && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              {table.rowCount.toLocaleString()}
                            </span>
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No tables found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Query editor and results */}
        <div className="col-span-9">
          <Card>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {/* Query editor */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="query" className="text-sm font-medium">
                      SQL Query
                    </label>
                    <Button
                      size="sm"
                      onClick={handleQueryExecution}
                      disabled={!query.trim() || queryLoading}
                    >
                      {queryLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Query
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-hidden sql-editor">
                    <style jsx global>{`
                      .sql-editor .cm-editor {
                        font-family:
                          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                          "Liberation Mono", "Courier New", monospace;
                        font-size: 14px;
                      }
                      .sql-editor .cm-content {
                        padding: 8px 0;
                      }
                      .sql-editor .cm-line {
                        padding: 0 10px;
                      }
                      .sql-editor .cm-gutters {
                        background-color: #f9fafb;
                        border-right: 1px solid #e5e7eb;
                        color: #6b7280;
                      }
                    `}</style>
                    <CodeMirror
                      value={query}
                      height="160px"
                      extensions={[sql()]}
                      theme={sqlTheme}
                      onChange={(value) => setQuery(value)}
                      placeholder="SELECT * FROM users;"
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLine: false,
                        highlightSelectionMatches: true,
                        foldGutter: false,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: true,
                        bracketMatching: true,
                      }}
                    />
                  </div>
                </div>

                {/* Error display */}
                {error && (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Results display */}
                <div className="h-[calc(100vh-400px)] overflow-auto">
                  {result ? (
                    <QueryResults result={result} />
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      Run a query to see results
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
