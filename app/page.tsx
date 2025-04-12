"use client";
import React from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
