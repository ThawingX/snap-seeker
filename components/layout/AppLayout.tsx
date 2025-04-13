"use client";
import React from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Navigation, AuthButtons } from "@/components/layout/Navigation";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "hidden md:flex w-full flex-1 flex-col overflow-hidden bg-white md:flex-row dark:bg-neutral-900",
        "h-screen",
      )}
    >
      <Sidebar animate={false}>
        <SidebarBody className="flex flex-col justify-between gap-10 border-r border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <Navigation />
          </div>
          <AuthButtons />
        </SidebarBody>
      </Sidebar>
      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}; 