
import Menu from "@/components/Menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gem } from "lucide-react";
import React from "react";


export default function DashboardLayout({ children }) {
  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1"><Menu />{children}</main>
        <footer className="flex justify-center items-center gap-2 text-xs text-muted text-center py-4">
          <p>powered by LLM GEM </p><Gem size={16}/>
        </footer>
      </div>
    </ScrollArea>
  );
}
