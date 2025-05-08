import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

export function TechnicianSelect({ value = [], onChange, members }) {
  const toggle = (id) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal text-sm text-muted-foreground "
        >
          {value.length > 0
            ? members
                .filter((m) => value.includes(m.id))
                .map((m) => m.fullName)
                .join(", ")
            : "Select technician"}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border shadow-sm bg-background"
        align="start"
      >
        <div className="max-h-[200px] overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-accent cursor-pointer transition-colors"
              
            >
              <Checkbox
                checked={value.includes(member.id)}
                onCheckedChange={() => toggle(member.id)}
                id={member.id}
              />
              <label
                htmlFor={member.id}
                className="text-sm text-foreground flex-1 cursor-pointer"
              >
                {member.fullName}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}