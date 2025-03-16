import { useState } from "react";
import { Connection, Table } from "@/lib/types";
import { useTables, useTableColumns, useQuery } from "@/lib/hooks";
import { Loader2, Database, Table as TableIcon, RefreshCw, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryResults } from "@/components/query-results";

interface TableBrowserProps {
  connection: Connection;
}

export function TableBrowser({ connection }: TableBrowserProps) {
  const { isLoading, tables, error, refetchTables } = useTables(connection);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableView, setTableView] = useState<"structure" | "data">("structure");
  
  const { columns, isLoading: columnsLoading } = useTableColumns(
    connection,
    selectedTable?.name || "",
    selectedTable?.schema || "public"
  );

  const { isLoading: dataLoading, result: tableData, runQuery } = useQuery();

  const handleSelectTable = async (table: Table) => {
    setSelectedTable(table);
    setTableView("structure");
    
    // We'll load data when the user switches to the data tab
  };
  
  const loadTableData = async () => {
    if (!selectedTable) return;
    
    const query = `SELECT * FROM "${selectedTable.schema}"."${selectedTable.name}" LIMIT 100`;
    await runQuery(connection, query);
  };

  // When the user switches to the data tab, load the data
  const handleViewChange = (view: "structure" | "data") => {
    setTableView(view);
    if (view === "data" && selectedTable && !tableData) {
      loadTableData();
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Database Tables</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetchTables()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
        <div className="border rounded-md p-2 overflow-y-auto max-h-[calc(100vh-250px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
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
                    className="w-full justify-start text-sm"
                    onClick={() => handleSelectTable(table)}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {table.schema !== "public"
                        ? `${table.schema}.${table.name}`
                        : table.name}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-3 border rounded-md p-4 overflow-hidden max-h-[calc(100vh-250px)]">
          {selectedTable ? (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">
                    {selectedTable.schema !== "public"
                      ? `${selectedTable.schema}.${selectedTable.name}`
                      : selectedTable.name}
                  </h4>
                  {selectedTable.rowCount !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {selectedTable.rowCount.toLocaleString()} rows
                    </p>
                  )}
                </div>
                
                <Tabs value={tableView} onValueChange={(v) => handleViewChange(v as "structure" | "data")}>
                  <TabsList>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="overflow-auto flex-1">
                {tableView === "structure" ? (
                  columnsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Nullable</TableHead>
                          <TableHead>Default</TableHead>
                          <TableHead>Key</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {columns.map((column) => (
                          <TableRow key={column.name}>
                            <TableCell className="font-medium">
                              {column.name}
                            </TableCell>
                            <TableCell>{column.dataType}</TableCell>
                            <TableCell>
                              {column.nullable ? "YES" : "NO"}
                            </TableCell>
                            <TableCell>
                              {column.defaultValue || ""}
                            </TableCell>
                            <TableCell>
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
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Button 
                        size="sm" 
                        onClick={loadTableData}
                        disabled={dataLoading}
                      >
                        {dataLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Refresh
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Insert
                        </Button>
                      </div>
                    </div>
                    
                    {dataLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : tableData ? (
                      <QueryResults result={tableData} editMode={true} />
                    ) : (
                      <div className="flex justify-center items-center h-32 text-muted-foreground">
                        <p>No data loaded yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <TableIcon className="h-8 w-8 mb-2" />
              <p>Select a table to view its structure and data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}