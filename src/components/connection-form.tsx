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
    }
  );

  const handleChange = (
    field: keyof Connection,
    value: string | number | boolean
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700 flex items-center"
          >
            Connection Name <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="My Database"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="host" className="text-sm font-medium text-slate-700">
            Host <span className="text-red-500">*</span>
          </label>
          <Input
            id="host"
            value={formData.host}
            onChange={(e) => handleChange("host", e.target.value)}
            placeholder="localhost"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="port" className="text-sm font-medium text-slate-700">
            Port <span className="text-red-500">*</span>
          </label>
          <Input
            id="port"
            type="number"
            value={formData.port}
            onChange={(e) => handleChange("port", parseInt(e.target.value))}
            placeholder="5432"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="database"
            className="text-sm font-medium text-slate-700"
          >
            Database <span className="text-red-500">*</span>
          </label>
          <Input
            id="database"
            value={formData.database}
            onChange={(e) => handleChange("database", e.target.value)}
            placeholder="postgres"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-700"
          >
            Username <span className="text-red-500">*</span>
          </label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="postgres"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
            className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sslMode"
            className="text-sm font-medium text-slate-700"
          >
            SSL Mode
          </label>
          <Select
            value={formData.sslMode as string}
            onValueChange={(val) => handleChange("sslMode", val)}
          >
            <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-slate-400">
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

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-200 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isEditing ? "Update Connection" : "Save Connection"}
        </Button>
      </div>
    </form>
  );
}
