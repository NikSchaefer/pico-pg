import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Loader2, TableIcon, Database } from "lucide-react";
import { Connection, Table } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  connection: Connection;
  tables: Table[];
  tablesLoading: boolean;
  selectedTable: Table | null;
  onTableSelect: (table: Table) => void;
}

export function AppSidebar({
  connection,
  tables,
  tablesLoading,
  selectedTable,
  onTableSelect,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-slate-200 bg-white/50 backdrop-blur-sm">
      <SidebarHeader className="px-6 pt-6 pb-4">
        <Link href="/" className="group">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <Database className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 text-lg">
                {connection.name}
              </h1>
              <p className="text-xs text-slate-500">
                {connection.host}:{connection.port}
              </p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-2">
            Tables
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {tablesLoading ? (
              <div className="flex h-32 w-full items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  <p className="text-xs text-slate-400">Loading tables...</p>
                </div>
              </div>
            ) : tables.length > 0 ? (
              <SidebarMenu>
                {tables.map((table) => (
                  <SidebarMenuItem
                    key={table.name}
                    value={table.name}
                    onClick={() => onTableSelect(table)}
                  >
                    <SidebarMenuButton
                      className={cn(
                        "text-sm rounded-lg transition-all duration-200",
                        selectedTable?.name === table.name
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <TableIcon className="mr-3 h-4 w-4" />
                      <span className="truncate">{table.name}</span>
                      {table.schema !== "public" && (
                        <span className="ml-auto text-xs text-slate-400 font-mono">
                          {table.schema}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="flex h-32 w-full items-center justify-center">
                <div className="text-center space-y-2">
                  <TableIcon className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500">No tables found</p>
                  <p className="text-xs text-slate-400">
                    Try refreshing the connection
                  </p>
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <div className="text-xs text-slate-400 text-center">
          {tables.length} table{tables.length !== 1 ? "s" : ""}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
