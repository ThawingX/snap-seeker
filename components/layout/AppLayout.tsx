"use client";
import React from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Navigation, AuthButtons } from "@/components/layout/Navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "hidden md:flex w-full flex-1 flex-col overflow-hidden bg-gradient-soft md:flex-row",
        "h-screen",
      )}
    >
      <Sidebar animate={false}>
        <SidebarBody className="flex flex-col justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <ThemeToggle className="ml-2" />
            </div>
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