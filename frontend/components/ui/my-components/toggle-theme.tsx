"use client";
import { useTheme } from "next-themes";
import { Button } from "../../ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToggleTheme({ className = "" }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(className, "md:mr-4 md:mt-4")}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
