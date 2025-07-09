import { useState } from "react";
import { Connection, Table } from "@/lib/types";
import { useTables, useTableColumns, useQuery } from "@/lib/hooks";
import {
  Loader2,
  Database,
  Table as TableIcon,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryResults } from "@/components/query-results";
import { Textarea } from "@/components/ui/textarea";

interface TableBrowserProps {
  connection: Connection;
}

export function TableBrowser({ connection }: TableBrowserProps) {
  const { isLoading, tables, error, refetchTables } = useTables(connection);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [query, setQuery] = useState<string>("");

  const { columns, isLoading: columnsLoading } = useTableColumns(
    connection,
    selectedTable?.name || "",
    selectedTable?.schema || "public"
  );

  const { isLoading: queryLoading, result: queryResult, runQuery } = useQuery();

  const handleSelectTable = async (table: Table) => {
    setSelectedTable(table);

    // Generate and run the query for this table
    const schemaPrefix = table.schema !== "public" ? `${table.schema}.` : "";
    const tableQuery = `SELECT * FROM "${schemaPrefix}${table.name}" LIMIT 100`;
    setQuery(tableQuery);
    await runQuery(connection, tableQuery);
  };

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    await runQuery(connection, query);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Database Explorer
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetchTables()}
          disabled={isLoading}
          className="border-slate-200 hover:bg-slate-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh Tables
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Table list */}
        <div className="md:col-span-3 border border-slate-200 rounded-lg p-4 overflow-y-auto h-[calc(100vh-350px)] bg-white">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-500">
              <Database className="h-8 w-8 mb-2" />
              <p>No tables found</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {tables.map((table) => (
                <li key={`${table.schema}.${table.name}`}>
                  <Button
                    variant={
                      selectedTable?.name === table.name &&
                      selectedTable?.schema === table.schema
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start text-sm hover:bg-slate-50"
                    onClick={() => handleSelectTable(table)}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {table.schema !== "public"
                        ? `${table.schema}.${table.name}`
                        : table.name}
                    </span>
                    {table.rowCount !== undefined && (
                      <span className="ml-auto text-xs text-slate-500">
                        {table.rowCount.toLocaleString()}
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main content area */}
        <div className="md:col-span-9">
          {selectedTable ? (
            <div className="space-y-6">
              {/* Table metadata */}
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {selectedTable.schema !== "public"
                      ? `${selectedTable.schema}.${selectedTable.name}`
                      : selectedTable.name}
                  </h4>
                  {selectedTable.rowCount !== undefined && (
                    <p className="text-sm text-slate-500">
                      {selectedTable.rowCount.toLocaleString()} rows
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Insert Row
                  </Button>
                </div>
              </div>

              {/* Columns/structure info */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h5 className="font-medium mb-4 text-slate-900">
                  Table Structure
                </h5>
                {columnsLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <UITable>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="text-slate-700 font-medium">
                          Column
                        </TableHead>
                        <TableHead className="text-slate-700 font-medium">
                          Type
                        </TableHead>
                        <TableHead className="text-slate-700 font-medium">
                          Nullable
                        </TableHead>
                        <TableHead className="text-slate-700 font-medium">
                          Key
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columns.map((column) => (
                        <TableRow
                          key={column.name}
                          className="hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-900">
                            {column.name}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {column.dataType}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {column.nullable ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {column.isPrimaryKey
                              ? "PK"
                              : column.isForeignKey
                              ? "FK"
                              : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                )}
              </div>

              {/* SQL editor */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-slate-900">SQL Query</h5>
                  <Button
                    size="sm"
                    onClick={handleRunQuery}
                    disabled={!query.trim() || queryLoading}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {queryLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Running...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Run Query
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="font-mono h-28 mb-4 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                />

                {/* Results */}
                <div className="overflow-auto max-h-[calc(100vh-600px)]">
                  {queryLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  ) : queryResult ? (
                    <QueryResults result={queryResult} />
                  ) : (
                    <div className="flex justify-center items-center h-32 text-slate-500">
                      <p>Run query to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-350px)] text-slate-500 bg-white border border-slate-200 rounded-lg">
              <TableIcon className="h-8 w-8 mb-2" />
              <p>Select a table to view its structure and data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
