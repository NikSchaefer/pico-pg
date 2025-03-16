"use client";

import { Database } from "lucide-react";

export function PageHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">PicoPG</h1>
      </div>

      <p>
        Cmd-K
      </p>
    </header>
  );
}
