"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { Connection } from "@/lib/types";
import { getConnections, addConnection, updateConnection, deleteConnection } from "@/lib/storage";
import { toast } from "sonner";

interface ConnectionContextType {
  connections: Connection[];
  loading: boolean;
  addConnection: (connection: Connection) => void;
  updateConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  refreshConnections: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshConnections = () => {
    try {
      const loadedConnections = getConnections();
      setConnections(loadedConnections);
    } catch (error) {
      console.error("Failed to load connections:", error);
      toast.error("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConnections();
  }, []);

  const handleAddConnection = (connection: Connection) => {
    try {
      addConnection(connection);
      setConnections((prev) => [...prev, connection]);
      toast.success("Connection added successfully");
    } catch (error) {
      console.error("Failed to add connection:", error);
      toast.error("Failed to add connection");
    }
  };

  const handleUpdateConnection = (connection: Connection) => {
    try {
      updateConnection(connection);
      setConnections((prev) =>
        prev.map((conn) => (conn.id === connection.id ? connection : conn))
      );
      toast.success("Connection updated successfully");
    } catch (error) {
      console.error("Failed to update connection:", error);
      toast.error("Failed to update connection");
    }
  };

  const handleDeleteConnection = (id: string) => {
    try {
      deleteConnection(id);
      setConnections((prev) => prev.filter((conn) => conn.id !== id));
      toast.success("Connection deleted successfully");
    } catch (error) {
      console.error("Failed to delete connection:", error);
      toast.error("Failed to delete connection");
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        loading,
        addConnection: handleAddConnection,
        updateConnection: handleUpdateConnection,
        deleteConnection: handleDeleteConnection,
        refreshConnections,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
}