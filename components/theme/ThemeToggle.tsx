"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-sm",
          className
        )}
        disabled
      >
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </button>
    );
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // 触发主题切换埋点
    trackEvent(ANALYTICS_EVENTS.THEME_TOGGLE, {
      from_theme: theme,
      to_theme: newTheme,
      page: window.location.pathname
    });
    
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleThemeToggle}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <IconSun className="h-5 w-5 transition-all duration-300 rotate-0 scale-100 text-amber-500" />
      ) : (
        <IconMoon className="h-5 w-5 transition-all duration-300 rotate-0 scale-100 text-slate-600" />
      )}
    </button>
  );
}