import React from "react";

import { MessageCircle, User } from "lucide-react";
import { useTeam } from "@/lib/context/TeamProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export default function NoteComponent({ notes = [] }) {
  const { members } = useTeam();

  if (!notes.length) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">
          No notes yet. Add your first note.
        </p>
      </div>
    );
  }

  function getTech(id) {
    const tech = members?.find((member) => member.id === id);
    return tech || { fullName: "Unknown", imageUrl: "" };
  }

  return (
    <div className="mt-4">
      <header className="text-lg flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <span className="font-bold">Activity Notes</span>
      </header>

      <main className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3">
            <Avatar className="size-8 mt-1">
              <AvatarImage src={getTech(note.authorId).imageUrl} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">
                  {getTech(note.authorId).fullName}
                </p>
                <span className="text-muted-foreground text-xs">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm mt-1 pl-2 border-l-2 border-primary/20">
                {note.text}
              </p>
              <div className="flex justify-end gap-2">
                <Button size="icon" >
                  <Edit2 className="size-4" />
                </Button>
                 <Button size="icon" variant="destructive">
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
