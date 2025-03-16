import { QueryResult } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const renderCell = (value: any): string => {
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
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="font-medium">Affected rows: {rowCount}</span>
            {rowCount > 0 && (
              <span className="status-edited">Edited {rowCount}</span>
            )}
          </div>
          <span className="text-muted-foreground">
            {formatExecutionTime(executionTime)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 h-full flex flex-col">
      <div className="flex p-4 justify-between text-sm">
        <span className="font-medium">
          {rowCount} {rowCount === 1 ? "row" : "rows"}
        </span>
        <span className="text-muted-foreground">
          {formatExecutionTime(executionTime)}
        </span>
      </div>

      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {renderCell(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
