import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import type { User } from "better-auth";

export default function Layout({
  children,
  currentPath,
  user,
}: {
  children: React.ReactNode;
  currentPath: string;
  user: User;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar currentPath={currentPath} user={user} />

        <SidebarInset>
          <AdminHeader />
          <main className="p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
