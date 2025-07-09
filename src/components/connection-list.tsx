"use client";

import { cn } from "@/lib/utils";
import { Connection } from "@/lib/types";
import Link from "next/link";
import { Icon, MoreHorizontal } from "lucide-react";
import { elephant } from "@lucide/lab";
import { useEffect, useState } from "react";
import { useConnectionTest } from "@/lib/hooks";
import { toast } from "sonner";
import { AlertCircle, Edit, Copy, Trash2, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DatabaseConnectionCardProps {
  connection: Connection;
  className?: string;
  onEdit?: (connection: Connection) => void;
  onDelete?: (connection: Connection) => void;
}

const DatabaseConnectionCard: React.FC<DatabaseConnectionCardProps> = ({
  connection,
  className,
  onEdit,
  onDelete,
}) => {
  const { isLoading, isConnected, testConnection } = useConnectionTest();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    testConnection(connection);
  }, [connection, testConnection]);

  const handleCopyConnectionString = async () => {
    const connectionString = `postgresql://${connection.username}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`;
    try {
      await navigator.clipboard.writeText(connectionString);
      toast.success("Connection string copied to clipboard");
    } catch {
      toast.error("Failed to copy connection string");
    }
  };

  const handleConnect = () => {
    window.location.href = `/connection/${connection.id}`;
  };

  return (
    <div
      className={cn(
        "relative w-68 h-36 rounded-md overflow-hidden cursor-pointer group",
        "bg-background border border-border",
        "hover:bg-gray-50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Three-dot menu - top right, only visible on hover */}
      <div className="absolute top-2 right-2 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "p-1 rounded-md transition-opacity",
                "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem onClick={handleConnect}>
              <Play className="mr-2 h-4 w-4" />
              Connect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(connection)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Connection
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyConnectionString}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Connection String
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(connection)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

export function ConnectionList({
  connections,
  onEdit,
  onDelete,
}: {
  connections: Connection[];
  onEdit?: (connection: Connection) => void;
  onDelete?: (connection: Connection) => void;
}) {
  return (
    <div className="flex mb-4 justify-center flex-wrap gap-4 max-w-5xl mx-auto">
      {connections.map((connection) => (
        <DatabaseConnectionCard
          key={connection.id}
          connection={connection}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
