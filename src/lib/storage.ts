"use client";

import { Connection } from "@/lib/types";

// Storage keys
const CONNECTIONS_KEY = "picopg_connections";

// Simple encryption for passwords - in a real app, use a more secure method
const encryptPassword = (password: string): string => {
  // This is a very basic encryption, in a real app use a proper encryption library
  return btoa(password);
};

const decryptPassword = (encrypted: string): string => {
  // This is a very basic decryption, in a real app use a proper encryption library
  return atob(encrypted);
};

// Save connections to localStorage
export const saveConnections = (connections: Connection[]): void => {
  try {
    // Encrypt passwords before storing
    const secureConnections = connections.map(conn => ({
      ...conn,
      password: conn.password ? encryptPassword(conn.password) : "",
    }));
    
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(secureConnections));
  } catch (error) {
    console.error("Failed to save connections:", error);
    throw error;
  }
};

// Get connections from localStorage
export const getConnections = (): Connection[] => {
  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (!stored) return [];
    
    const connections = JSON.parse(stored) as Connection[];
    
    // Decrypt passwords
    return connections.map(conn => ({
      ...conn,
      password: conn.password ? decryptPassword(conn.password) : "",
    }));
  } catch (error) {
    console.error("Failed to get connections:", error);
    return [];
  }
};

// Add a new connection
export const addConnection = (connection: Connection): void => {
  const connections = getConnections();
  connections.push(connection);
  saveConnections(connections);
};

// Update an existing connection
export const updateConnection = (connection: Connection): void => {
  const connections = getConnections();
  const index = connections.findIndex(c => c.id === connection.id);
  
  if (index !== -1) {
    connections[index] = connection;
    saveConnections(connections);
  } else {
    throw new Error("Connection not found");
  }
};

// Delete a connection
export const deleteConnection = (id: string): void => {
  const connections = getConnections();
  const filtered = connections.filter(c => c.id !== id);
  saveConnections(filtered);
};

// Get a single connection by ID
export const getConnection = (id: string): Connection | undefined => {
  const connections = getConnections();
  return connections.find(c => c.id === id);
};