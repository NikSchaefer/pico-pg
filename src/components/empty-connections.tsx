import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyConnectionsProps {
  onAddConnection: () => void;
}

export function EmptyConnections({ onAddConnection }: EmptyConnectionsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <div className="rounded-full bg-background p-2">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-medium">No database connections</h3>
      <p className="mb-4 max-w-md text-sm text-muted-foreground">
        Add your first PostgreSQL database connection to get started.
        All connection details are stored locally.
      </p>
      <Button onClick={onAddConnection}>
        Add Connection
      </Button>
    </div>
  );
}