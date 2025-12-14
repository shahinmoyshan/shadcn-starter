import { useState } from "react";
import { Bell, BellOff, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useApp } from "@/contexts/app";

const notifications = [
  {
    id: 1,
    title: "New order",
    description: "Mrs. Eldridge Koch ordered 2 products.",
    time: "26 minutes ago",
    read: false,
    icon: ShoppingBag,
  },
  {
    id: 2,
    title: "New order",
    description: "Dr. Angelo Rempel ordered 3 products.",
    time: "26 minutes ago",
    read: false,
    icon: ShoppingBag,
  },
  {
    id: 3,
    title: "New order",
    description: "Marlon VonRueden ordered 3 products.",
    time: "26 minutes ago",
    read: false,
    icon: ShoppingBag,
  },
  {
    id: 4,
    title: "New order",
    description: "Daniela Schulist Sr. ordered 3 products.",
    time: "26 minutes ago",
    read: true,
    icon: ShoppingBag,
  },
  {
    id: 5,
    title: "New order",
    description: "Madisyn Considine ordered 4 products.",
    time: "26 minutes ago",
    read: true,
    icon: ShoppingBag,
  },
  {
    id: 6,
    title: "New order",
    description: "Arvid Lynch ordered 2 products.",
    time: "26 minutes ago",
    read: true,
    icon: ShoppingBag,
  },
];

export function SiteHeader() {
  const { currentMenu } = useApp();
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })));
  };

  const handleClear = () => {
    setNotificationList([]);
  };

  const handleRemove = (id) => {
    setNotificationList(notificationList.filter((n) => n.id !== id));
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm font-medium">{currentMenu().title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-105 p-0">
              {notificationList.length > 0 && (
                <SheetHeader className="border-b p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2 text-lg relative">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-4.5 flex h-4 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </SheetTitle>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="h-auto p-0 text-sm text-primary hover:no-underline"
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleClear}
                      className="h-auto p-0 text-sm text-destructive/85 hover:text-destructive hover:no-underline transition-colors"
                      disabled={notificationList.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </SheetHeader>
              )}

              <div className="h-[calc(100vh-120px)] overflow-y-auto">
                {notificationList.length > 0 ? (
                  <div className="divide-y">
                    {notificationList.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className="group relative flex gap-3.5 p-4 transition-colors hover:bg-accent/50"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </p>
                            <p className="text-sm text-muted-foreground leading-snug">
                              {notification.description}
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-sm text-primary hover:no-underline cursor-pointer"
                            >
                              View
                            </Button>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(notification.id)}
                              className="h-6 w-6 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center p-8 text-center">
                    <div className="relative mb-5 mt-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <BellOff className="size-7 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-base font-semibold">
                      No notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please check again later.
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
