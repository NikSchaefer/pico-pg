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
import { Loader2, TableIcon } from "lucide-react";
import { Connection, Table } from "@/lib/types";
import Link from "next/link";

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
    <Sidebar>
      <SidebarHeader className="px-8 pt-6 pb-3">
        <Link href="/">
          <h1 className="semibold text-xl">
            <span className="font-semibold">DB</span>{" "}
            <span className="text-foreground">/</span> {connection.name}
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tables</SidebarGroupLabel>
          <SidebarGroupContent>
            {tablesLoading ? (
              <div className="flex h-32 w-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : tables.length > 0 ? (
              <SidebarMenu>
                {tables.map((table) => (
                  <SidebarMenuItem
                    key={table.name}
                    value={table.name}
                    onClick={() => onTableSelect(table)}
                  >
                    <SidebarMenuButton>
                      <TableIcon className="mr-2 h-4 w-4" />
                      {table.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="flex h-32 w-full items-center justify-center text-sm text-slate-500">
                No tables found.
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
