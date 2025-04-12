"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Dashboard } from "@/components/layout/Dashboard";
import { Navigation, AuthButtons } from "@/components/layout/Navigation";

export default function Home() {
  const [open, setOpen] = useState(false);
  
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-white md:flex-row dark:bg-neutral-900",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <Navigation />
          </div>
          <AuthButtons />
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
