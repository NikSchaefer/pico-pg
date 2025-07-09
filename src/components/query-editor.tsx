import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Connection } from "@/lib/types";
import { useQuery } from "@/lib/hooks";
import { Play, Loader2 } from "lucide-react";
import { QueryResults } from "@/components/query-results";

interface QueryEditorProps {
  connection: Connection;
}

export function QueryEditor({ connection }: QueryEditorProps) {
  const [query, setQuery] = useState("");
  const { isLoading, result, error, runQuery } = useQuery();

  const handleQueryExecution = async () => {
    if (!query.trim()) return;
    await runQuery(connection, query);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <label htmlFor="query" className="text-sm font-medium text-slate-700">
            SQL Query
          </label>
          <Button
            size="sm"
            onClick={handleQueryExecution}
            disabled={!query.trim() || isLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isLoading ? (
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
        <Textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SELECT * FROM users;"
          className="font-mono h-40 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
        />
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg">
          <p className="font-medium text-red-900">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {result && <QueryResults result={result} />}
    </div>
  );
}
