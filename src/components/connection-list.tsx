import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Database, Edit, ExternalLink, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Connection } from "@/lib/types";
import { ConnectionDialog } from "./connection-dialog";
import { useConnections } from "@/app/context";
import { formatDistanceToNow } from "date-fns";

interface ConnectionListProps {
  connections: Connection[];
}

export function ConnectionList({ connections }: ConnectionListProps) {
  const { updateConnection, deleteConnection } = useConnections();
  const [editingConnection, setEditingConnection] = useState<
    Connection | undefined
  >(undefined);
  const [deletingConnectionId, setDeletingConnectionId] = useState<
    string | null
  >(null);

  const handleEdit = (connection: Connection) => {
    setEditingConnection(connection);
  };

  const handleDelete = (id: string) => {
    setDeletingConnectionId(id);
  };

  const confirmDelete = () => {
    if (deletingConnectionId) {
      deleteConnection(deletingConnectionId);
      setDeletingConnectionId(null);
    }
  };

  const handleUpdateConnection = (connection: Connection) => {
    updateConnection(connection);
    setEditingConnection(undefined);
  };

  const formatLastConnected = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Database</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Last Connected</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  {connection.name}
                </div>
              </TableCell>
              <TableCell>
                {connection.host}:{connection.port}
              </TableCell>
              <TableCell>{connection.database}</TableCell>
              <TableCell>{connection.username}</TableCell>
              <TableCell>
                {formatLastConnected(connection.lastConnected)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    title="Connect"
                    onClick={() => window.location.href = `/connection/${connection.id}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Edit"
                    onClick={() => handleEdit(connection)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Delete"
                    onClick={() => handleDelete(connection.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Connection Dialog */}
      {editingConnection && (
        <ConnectionDialog
          open={!!editingConnection}
          onOpenChange={(open) => !open && setEditingConnection(undefined)}
          connection={editingConnection}
          onSave={handleUpdateConnection}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingConnectionId}
        onOpenChange={(open) => !open && setDeletingConnectionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connection? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
