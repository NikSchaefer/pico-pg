import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Connection } from "@/lib/types";
import { useConnectionTest } from "@/lib/hooks";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface ConnectionTestProps {
  connection: Connection;
}

export function ConnectionTest({ connection }: ConnectionTestProps) {
  const { isLoading, isConnected, error, testConnection } = useConnectionTest();
  const [tested, setTested] = useState(false);

  const handleTest = async () => {
    await testConnection(connection);
    setTested(true);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        onClick={handleTest}
        variant="outline"
        loading={isLoading}
        className="border-slate-200 hover:bg-slate-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          "Test Connection"
        )}
      </Button>

      {tested && !isLoading && (
        <div className="flex items-center mt-2">
          {isConnected ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Connection successful</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">
                {error || "Connection failed"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
