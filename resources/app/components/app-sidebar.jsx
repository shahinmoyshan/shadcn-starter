import * as React from "react";
import { Eclipse } from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth";
import { useApp } from "@/contexts/app";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const { menu } = useApp();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Eclipse className="size-5!" />
                <span className="text-base font-semibold">
                  {CONFIG.app.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu.navMain} />
        <NavDocuments items={menu.documents} />
        <NavSecondary items={menu.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: user?.avatar_url || null,
            name: user?.display_name || user?.username || user?.name || "Guest",
            email: user?.email || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
