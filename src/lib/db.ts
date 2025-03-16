"use server";

import { Connection, QueryResult, Database, Table, Column } from "@/lib/types";
import { Pool } from "pg";

export async function testConnection(
  connection: Connection,
): Promise<{ success: boolean; error?: unknown }> {
  const client = new Pool({
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.sslMode,
  });

  try {
    await client.query("SELECT 1");
    return { success: true };
  } catch (error) {
    console.error("Connection test failed:", error);
    return { success: false, error: error };
  } finally {
    await client.end();
  }
}

export async function executeQuery(
  connection: Connection,
  query: string,
): Promise<QueryResult> {
  const client = new Pool({
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.sslMode,
  });

  try {
    const startTime = performance.now();
    const result = await client.query(query);
    const endTime = performance.now();

    return {
      columns: result.fields?.map((field) => field.name) || [],
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
      executionTime: endTime - startTime,
    };
  } catch (error) {
    console.error("Query execution failed:", error);
    throw new Error(`Failed to execute query: ${error}`);
  } finally {
    await client.end();
  }
}

export async function getDatabases(
  connection: Connection,
): Promise<Database[]> {
  const client = new Pool({
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.sslMode,
  });

  try {
    // Query to get list of databases
    const result = await client.query(`
      SELECT datname as name
      FROM pg_database
      WHERE datistemplate = false
      ORDER BY name
    `);

    return result.rows.map((row) => ({
      name: row.name,
      tables: [],
    }));
  } catch (error) {
    console.error("Failed to get databases:", error);
    throw new Error(`Failed to get databases: ${error}`);
  } finally {
    await client.end();
  }
}

export async function getTables(connection: Connection): Promise<Table[]> {
  const client = new Pool({
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.sslMode,
  });

  try {
    // Query to get tables with their row counts
    const tablesResult = await client.query(`
      SELECT
        schemaname as schema,
        tablename as name,
        (SELECT count(*) FROM "${connection.database}".information_schema.tables WHERE table_schema = schemaname AND table_name = tablename) as "rowCount"
      FROM pg_tables
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema, name
    `);

    const tables: Table[] = [];

    for (const tableRow of tablesResult.rows) {
      // Get columns for each table
      const columns = await getTableColumns(
        connection,
        tableRow.name,
        tableRow.schema,
      );

      tables.push({
        schema: tableRow.schema,
        name: tableRow.name,
        columns,
        rowCount: parseInt(tableRow.rowCount, 10) || 0,
      });
    }

    return tables;
  } catch (error) {
    console.error("Failed to get tables:", error);
    throw new Error(`Failed to get tables: ${error}`);
  } finally {
    await client.end();
  }
}

export async function getTableColumns(
  connection: Connection,
  table: string,
  schema: string = "public",
): Promise<Column[]> {
  const client = new Pool({
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.sslMode,
  });

  try {
    // Get column information
    const columnsResult = await client.query(
      `
      SELECT
        column_name as name,
        data_type as "dataType",
        is_nullable = 'YES' as nullable,
        column_default as "defaultValue"
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position
    `,
      [schema, table],
    );

    // Get primary key information
    const pkResult = await client.query(
      `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = $1
      AND tc.table_name = $2
    `,
      [schema, table],
    );

    const primaryKeys = new Set(pkResult.rows.map((row) => row.column_name));

    // Get foreign key information
    const fkResult = await client.query(
      `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = $1
      AND tc.table_name = $2
    `,
      [schema, table],
    );

    const foreignKeys = new Set(fkResult.rows.map((row) => row.column_name));

    // Combine all the information
    return columnsResult.rows.map((row) => ({
      name: row.name,
      dataType: row.dataType,
      nullable: row.nullable,
      isPrimaryKey: primaryKeys.has(row.name),
      isForeignKey: foreignKeys.has(row.name),
      defaultValue: row.defaultValue,
    }));
  } catch (error) {
    console.error(`Failed to get columns for table ${schema}.${table}:`, error);
    throw new Error(
      `Failed to get columns for table ${schema}.${table}: ${error}`,
    );
  } finally {
    await client.end();
  }
}

export async function updateLastConnectedTime(
  connection: Connection,
): Promise<Connection> {
  try {
    // Test the connection is valid before updating
    const isValid = await testConnection(connection);

    if (!isValid) {
      throw new Error("Cannot update connection time for invalid connection");
    }

    // Update the last connected time
    const updatedConnection = {
      ...connection,
      lastConnected: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a full implementation, this would save to persistent storage
    // For example: await localStorage.setItem('connections', JSON.stringify([...otherConnections, updatedConnection]));

    return updatedConnection;
  } catch (error) {
    console.error("Failed to update last connected time:", error);
    return connection;
  }
}
