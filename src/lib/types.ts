import { ConnectionOptions } from "node:tls";

export interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string; // Should be encrypted when stored
  sslMode?: ConnectionOptions;
  lastConnected?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryResult {
  columns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  rowCount: number;
  executionTime: number;
}

export interface Database {
  name: string;
  tables: Table[];
}

export interface Table {
  schema: string;
  name: string;
  columns: Column[];
  rowCount?: number;
}

export interface Column {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
}
