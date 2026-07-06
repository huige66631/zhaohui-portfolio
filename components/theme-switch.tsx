"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeSwitch(): ReactNode {
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="w-12 h-12 rounded-full bg-foreground/10 opacity-30 cursor-not-allowed"
          aria-label="Toggle theme"
          disabled
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="flex h-10 w-10 cursor-default items-center justify-center rounded-full bg-muted/70 text-foreground/72 opacity-80 shadow-lg"
        aria-label={isDark ? "Dark theme active" : "Light theme active"}
        aria-pressed={isDark}
        type="button"
        disabled
      >
        {isDark ? (
          <Sun className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Moon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
