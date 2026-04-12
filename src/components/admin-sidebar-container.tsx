import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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

        <SidebarInset className="overflow-x-hidden">
          <AdminHeader />
          <main className="p-4 pb-16">{children}</main>
          <Toaster position="top-center" />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
