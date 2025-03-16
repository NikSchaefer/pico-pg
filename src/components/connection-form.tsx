"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Connection } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { testConnection } from "@/lib/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ConnectionOptions } from "node:tls";

interface ConnectionFormProps {
  connection?: Connection;
  onSave: (connection: Connection) => void;
  onCancel: () => void;
}

export function ConnectionForm({
  connection,
  onSave,
  onCancel,
}: ConnectionFormProps) {
  const isEditing = !!connection;

  const [formData, setFormData] = useState<Partial<Connection>>(
    connection || {
      name: "",
      host: "localhost",
      port: 5432,
      database: "",
      username: "postgres",
      password: "",
      sslMode: "require" as ConnectionOptions,
    },
  );

  const handleChange = (
    field: keyof Connection,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.host ||
      !formData.database ||
      !formData.username
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const now = new Date().toISOString();

    const newConnection: Connection = {
      id: connection?.id || uuidv4(),
      name: formData.name!,
      host: formData.host!,
      port: formData.port || 5432,
      database: formData.database!,
      username: formData.username!,
      password: formData.password!,
      sslMode: formData.sslMode,
      createdAt: connection?.createdAt || now,
      updatedAt: now,
    };

    // Attempt to test connection
    const { success, error } = await testConnection(newConnection);

    if (success) {
      onSave(newConnection);
    } else {
      toast.error(`Connection failed: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium flex items-center"
          >
            Connection Name <span className="text-destructive ml-1">*</span>
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="My Database"
            className="bg-input border-border focus-visible:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="host" className="text-sm font-medium">
            Host <span className="text-destructive">*</span>
          </label>
          <Input
            id="host"
            value={formData.host}
            onChange={(e) => handleChange("host", e.target.value)}
            placeholder="localhost"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="port" className="text-sm font-medium">
            Port <span className="text-destructive">*</span>
          </label>
          <Input
            id="port"
            type="number"
            value={formData.port}
            onChange={(e) => handleChange("port", parseInt(e.target.value))}
            placeholder="5432"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="database" className="text-sm font-medium">
            Database <span className="text-destructive">*</span>
          </label>
          <Input
            id="database"
            value={formData.database}
            onChange={(e) => handleChange("database", e.target.value)}
            placeholder="postgres"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username <span className="text-destructive">*</span>
          </label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="postgres"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sslMode" className="text-sm font-medium">
            SSL Mode
          </label>
          <Select
            value={formData.sslMode as string}
            onValueChange={(val) => handleChange("sslMode", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="require">Require</SelectItem>
              <SelectItem value="verify-ca">Verify CA</SelectItem>
              <SelectItem value="verify-full">Verify Full</SelectItem>
              <SelectItem value="disable">Disable</SelectItem>
              <SelectItem value="prefer">Prefer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Connection" : "Save Connection"}
        </Button>
      </div>
    </form>
  );
}
