"use client";

import { cn } from "@/lib/utils";
import { Connection } from "@/lib/types";
import Link from "next/link";
import { Icon } from "lucide-react";
import { elephant } from "@lucide/lab";
import { useEffect } from "react";
import { useConnectionTest } from "@/lib/hooks";
import { AlertCircle } from "lucide-react";

interface DatabaseConnectionCardProps {
  connection: Connection;
  className?: string;
}

const DatabaseConnectionCard: React.FC<DatabaseConnectionCardProps> = ({
  connection,
  className,
}) => {
  const { isLoading, isConnected, testConnection } = useConnectionTest();

  // Automatically test connection when component mounts
  useEffect(() => {
    testConnection(connection);
  }, [connection, testConnection]);

  return (
    <div
      className={cn(
        "relative w-68 h-36 rounded-md overflow-hidden cursor-pointer",
        "bg-background border border-border",
        "hover:bg-gray-50",
        className
      )}
    >
      {/* Connection failure indicator - top right */}
      {!isLoading && isConnected === false && (
        <div className="absolute top-2 right-2 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-200 rounded-md">
            <AlertCircle className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-600">
              Test connection failed
            </span>
          </div>
        </div>
      )}

      <Link href={`/connection/${connection.id}`} className="block h-full">
        <div className="relative z-10 p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "w-10 h-10 rounded-sm flex items-center justify-center",
                "border border-border"
              )}
            >
              <Icon iconNode={elephant} />
            </div>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-1">
            {connection.name}
          </h3>

          <div className="flex items-center gap-2 mb-auto">
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {connection.database}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export function ConnectionList({ connections }: { connections: Connection[] }) {
  return (
    <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto">
      {connections.map((connection) => (
        <DatabaseConnectionCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}
