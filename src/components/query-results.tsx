import { QueryResult } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Database } from "lucide-react";

interface QueryResultsProps {
  result: QueryResult;
}

export function QueryResults({ result }: QueryResultsProps) {
  const { columns, rows, rowCount, executionTime } = result;

  // Format the execution time in a readable way
  const formatExecutionTime = (time: number): string => {
    if (time < 1) return "<1ms";
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  // Function to render a cell value based on its type
  const renderCell = (value: unknown): string => {
    if (value === null) return "NULL";
    if (value === undefined) return "";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  // Handle case with no columns (like INSERT/UPDATE queries)
  if (columns.length === 0) {
    return (
      <div className="p-6 overflow-x-auto overflow-y-auto">
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Database className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">
                Query executed successfully
              </p>
              <p className="text-sm text-green-700">
                Affected {rowCount} row{rowCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatExecutionTime(executionTime)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-200">
            <Database className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <span className="font-medium text-slate-900">
              {rowCount} {rowCount === 1 ? "row" : "rows"}
            </span>
            <span className="text-sm text-slate-500 ml-2">
              {columns.length} column{columns.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            {formatExecutionTime(executionTime)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="text-slate-700 font-medium text-sm"
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-slate-50">
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="text-sm text-slate-700"
                    >
                      {renderCell(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
