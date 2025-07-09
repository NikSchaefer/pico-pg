import { Button } from "@/components/ui/button";
import { Loader2, Play, Database } from "lucide-react";
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
    <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-slate-100">
          <Database className="h-4 w-4 text-slate-600" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-slate-900">
            {selectedTable
              ? selectedTable.schema !== "public"
                ? `${selectedTable.schema}.${selectedTable.name}`
                : selectedTable.name
              : "SQL Query"}
          </h2>
          <p className="text-xs text-slate-500">
            {selectedTable ? "Table" : "Custom query"}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        onClick={onRunQuery}
        disabled={queryEmpty || isLoading}
        className="gap-2 h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Query
          </>
        )}
      </Button>
    </div>
  );
}
