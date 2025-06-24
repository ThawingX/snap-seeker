"use client";
import React from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Navigation, AuthButtons } from "@/components/layout/Navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { IconBrandDiscord } from "@tabler/icons-react";

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
              <ThemeToggle className="ml-0" />
            </div>
            <div className="mb-4">
              <a
                href="https://discord.gg/CSkT2BdNKy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-300 shadow-lg hover:shadow-xl border border-[#5865F2]/30 hover:border-[#5865F2]/50 backdrop-blur-sm"
                aria-label="Join our Discord community"
              >
                <IconBrandDiscord className="h-4 w-4" />
              </a>
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