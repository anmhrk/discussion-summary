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
      className="p-2 h-fit rounded-full bg-gray-200 dark:bg-[#2D2D2F] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#3D3D3F] transition-colors"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
