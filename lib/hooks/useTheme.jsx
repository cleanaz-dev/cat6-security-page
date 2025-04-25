"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        className={`rounded-full cursor-pointer ${
          theme === "dark" ? "text-primary bg-transparent hover:bg-transparent hover:text-white" : "text-white "
        } transition-colors `}
        onClick={() => setTheme("light")}
      >
        <Sun />
      </Button>
      <Button
        size="icon"
        className={`rounded-full cursor-pointer   ${
          theme === "light" ? "text-primary bg-transparent hover:bg-slate-300" : "text-white "
        } transition-colors `}
        onClick={() => setTheme("dark")}
      >
        <Moon />
      </Button>
    </div>
  );
};
