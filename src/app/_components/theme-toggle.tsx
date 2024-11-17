"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="custom"
      className="p-2 h-fit rounded-full transition-colors"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
