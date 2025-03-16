import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { Table } from "@/lib/types";

interface QueryToolbarProps {
  selectedTable: Table | null;
  onRunQuery: () => Promise<void>;
  isLoading: boolean;
  queryEmpty: boolean;
}

export default function QueryToolbar({
  selectedTable,
  onRunQuery,
  isLoading,
  queryEmpty,
}: QueryToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700 p-4">
      <div className="flex items-center">
        <h2 className="text-sm font-medium">
          {selectedTable
            ? selectedTable.schema !== "public"
              ? `${selectedTable.schema}.${selectedTable.name}`
              : selectedTable.name
            : "SQL Query"}
        </h2>
      </div>
      <Button
        size="sm"
        onClick={onRunQuery}
        disabled={queryEmpty || isLoading}
        className="gap-1 h-8"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Run Query
          </>
        )}
      </Button>
    </div>
  );
}
