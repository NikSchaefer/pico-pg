import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyConnectionsProps {
  onAddConnection: () => void;
}

export function EmptyConnections({ onAddConnection }: EmptyConnectionsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="mb-2 text-lg font-medium">No database connections</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        Add your first PostgreSQL database connection to get started. All
        connection details are stored locally.
      </p>
      <Button onClick={onAddConnection} className="px-6">
        <Plus className="h-4 w-4 mr-1" />
        Add Connection
      </Button>
    </div>
  );
}
