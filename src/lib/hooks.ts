import { useState, useEffect, useCallback } from "react";
import { Connection, QueryResult, Table, Column } from "@/lib/types";
import {
  testConnection,
  executeQuery,
  getTables,
  getTableColumns,
  updateLastConnectedTime,
} from "@/lib/db";
import { updateConnection } from "@/lib/storage";
import { toast } from "sonner";

// Hook for testing database connection
export function useConnectionTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testDbConnection = useCallback(async (connection: Connection) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await testConnection(connection);
      setIsConnected(result.success);

      if (result.success) {
        // Update the last connected time in storage
        const updatedConnection = await updateLastConnectedTime(connection);
        updateConnection(updatedConnection);

        toast.success("Connected successfully");
      } else {
        setError("Could not connect to database");
        toast.error("Connection failed");
      }

      return result;
    } catch (err) {
      setIsConnected(false);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      toast.error("Connection error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isConnected,
    error,
    testConnection: testDbConnection,
  };
}

// Hook for executing queries
export function useQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(
    async (connection: Connection, query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryResult = await executeQuery(connection, query);
        setResult(queryResult);

        // Update the last connected time in storage
        const updatedConnection = await updateLastConnectedTime(connection);
        updateConnection(updatedConnection);

        return queryResult;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    result,
    error,
    runQuery,
  };
}

// Hook for fetching database tables
export function useTables(connection: Connection | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    if (!connection) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTables(connection);
      setTables(result);

      // Update the last connected time in storage
      const updatedConnection = await updateLastConnectedTime(connection);
      updateConnection(updatedConnection);

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      toast.error("Failed to fetch tables");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    if (connection) {
      fetchTables();
    } else {
      setTables([]);
    }
  }, [connection, fetchTables]);

  return {
    isLoading,
    tables,
    error,
    refetchTables: fetchTables,
  };
}

// Hook for fetching table columns
export function useTableColumns(
  connection: Connection | null,
  table: string,
  schema: string = "public",
) {
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = useCallback(async () => {
    if (!connection || !table) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTableColumns(connection, table, schema);
      setColumns(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      toast.error("Failed to fetch columns");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [connection, table, schema]);

  useEffect(() => {
    if (connection && table) {
      fetchColumns();
    } else {
      setColumns([]);
    }
  }, [connection, table, schema, fetchColumns]);

  return {
    isLoading,
    columns,
    error,
    refetchColumns: fetchColumns,
  };
}
