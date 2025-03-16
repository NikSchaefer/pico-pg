"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Database, Key, Plus, RefreshCw, Settings, Table } from "lucide-react";
import { useConnections } from "@/app/context";
import { useRouter } from "next/navigation";

interface CommandMenuProps {
  onNewConnection?: () => void;
}

export function CommandMenu({ onNewConnection }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { connections, refreshConnections } = useConnections();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNewConnection = () => {
    setOpen(false);
    // We'll handle this in the page component
    const newConnectionEvent = new CustomEvent("new-connection");
    document.dispatchEvent(newConnectionEvent);
  };

  const handleRefreshConnections = () => {
    refreshConnections();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Connections">
          <CommandItem onSelect={handleNewConnection}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Connection
          </CommandItem>
          <CommandItem onSelect={handleRefreshConnections}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Connections
          </CommandItem>
        </CommandGroup>

        {connections.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Connections">
              {connections.slice(0, 5).map((connection) => (
                <CommandItem
                  key={connection.id}
                  onSelect={() => {
                    setOpen(false);
                    // Navigate to connection page in the future
                  }}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {connection.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Database Tools">
          <CommandItem onSelect={() => setOpen(false)}>
            <Table className="mr-2 h-4 w-4" />
            Browse Tables
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>
            <Key className="mr-2 h-4 w-4" />
            Test Connection
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => setOpen(false)}>
            <Settings className="mr-2 h-4 w-4" />
            Application Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
