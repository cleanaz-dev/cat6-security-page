import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";


export default function DashboardLayout({ children }) {
  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="text-xs text-muted text-center py-4">
          <p>powered by LLM GEM</p>
        </footer>
      </div>
    </ScrollArea>
  );
}
