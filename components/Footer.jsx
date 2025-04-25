import Link from "next/link";
import { Shield, Gem } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t pt-4 md:pt-8 pb-4 bg-background">
      <div className="container flex flex-col items-center justify-between gap-1.5 md:gap-6 md:flex-row px-4 md:px-6 mx-auto ">
        <div className="flex items-center gap-3 min-w-fit">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold whitespace-nowrap">
            Cat6 Security
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[11px] lg:text-sm text-muted-foreground whitespace-nowrap">
            © {new Date().getFullYear()} Cat6 Security. All rights reserved.
          </p>
        </div>

        <nav className="flex gap-2 items-center md:items-end ">
          <Link
            href="#"
            className="text-[11px] lg:text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[11px] lg:text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
      <div className="flex justify-center text-xs text-muted-foreground/80 hover:text-muted-foreground transition-colors px-2 py-1">
        <span>Powered by </span>
        <Link href="https://llmgem.com">
        <span className="font-medium text-primary/80 flex items-center gap-1 ml-1 ">
         LLM GEM
          <Gem className="size-4" />
        </span>
        </Link>
      </div>
    </footer>
  );
}
