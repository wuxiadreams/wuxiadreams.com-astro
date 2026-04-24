import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, BookOpen, Rss, BrushCleaning } from "lucide-react";
import { AdminSidebarMenu } from "./admin-sidebar-menu";
import { AdminSidebarFooter } from "./admin-sidebar-footer";
import type { User } from "better-auth";

const menus = [
  {
    title: "用户管理",
    url: "#",
    icon: Users,
    isActive: true,
    items: [
      {
        title: "用户列表",
        url: "/admin/users",
      },
    ],
  },
  {
    title: "小说管理",
    url: "#",
    icon: BookOpen,
    isActive: false,
    items: [
      {
        title: "小说列表",
        url: "/admin/novels",
      },
      {
        title: "作者管理",
        url: "/admin/authors",
      },
      {
        title: "分类管理",
        url: "/admin/categories",
      },
      {
        title: "标签管理",
        url: "/admin/tags",
      },

      {
        title: "排行榜",
        url: "/admin/rankings",
      },
    ],
  },
  {
    title: "文章管理",
    url: "#",
    icon: Rss,
    isActive: false,
    items: [
      {
        title: "文章列表",
        url: "/admin/posts",
      },
    ],
  },
  {
    title: "缓存管理",
    url: "#",
    icon: BrushCleaning,
    isActive: false,
    items: [
      {
        title: "清理缓存",
        url: "/admin/cache",
      },
    ],
  },
];

export function AdminSidebar({
  currentPath,
  user,
}: {
  currentPath: string;
  user: User;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-2 p-2">
          <img src="/logo.png" alt="website logo" width={44} height={44} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-lg">Wuxia Dreams</span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>管理后台</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AdminSidebarMenu items={menus} currentPath={currentPath} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AdminSidebarFooter user={user} />
    </Sidebar>
  );
}
