
import Menu from "@/components/Menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gem } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";


export default async  function DashboardLayout({ children }) {

  const user = await currentUser();

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    
    <ScrollArea className="h-screen">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Menu user={user.id}/>
          {children}
        </main>
        <footer className="flex justify-center items-center gap-2 text-xs text-muted-foreground text-center py-4">
          <p>powered by LLM GEM</p>
          <Gem size={16} />
        </footer>
      </div>
    </ScrollArea>
  );
}