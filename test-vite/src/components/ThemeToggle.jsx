// components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/theme-context";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggleTheme()}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={"dark:border-b-slate-500 dark:bg-gradient-to-b dark:from-slate-600 dark:via-slate-800 dark:to-slate-700"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
