"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        className={`rounded-full cursor-pointer ${
          theme === "dark"
            ? "text-primary bg-transparent hover:bg-transparent hover:text-white"
            : "text-white "
        } transition-colors `}
        onClick={() => setTheme("light")}
      >
        <Sun />
      </Button>
      <Button
        size="icon"
        className={`rounded-full cursor-pointer   ${
          theme === "light"
            ? "text-primary bg-transparent hover:bg-slate-300"
            : "text-white "
        } transition-colors `}
        onClick={() => setTheme("dark")}
      >
        <Moon />
      </Button>
    </div>
  );
};

export const NavThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        className={`rounded-full cursor-pointer group ${
          theme === "dark"
            ? "text-primary-muted bg-transparent hover:bg-transparent hover:text-white"
            : "text-background"
        } transition-colors `}
        onClick={() => setTheme("light")}
      >
        <Sun className="group-hover:rotate-180 transition-all duration-200"/>
      </button>
      <button
        className={`rounded-full cursor-pointer group  ${
          theme === "light"
            ? "text-primary-muted bg-transparent hover:text-black transition-all duration-200"
            : "text-background "
        } transition-colors `}
        onClick={() => setTheme("dark")}
      >
        <Moon className="group-hover:rotate-180 transition-all duration-200"/>
      </button>
    </div>
  );
};
