"use client";

import Link from "next/link";
import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeChanger } from "@/lib/hooks/useTheme";
import { useState } from "react";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        {/* Left side: Logo */}
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="text-xl font-bold">Cat6 Security</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeChanger />
          <Button asChild>
            <Link href="#contact">Get a Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2 ">
         
          <div className="ml-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                className="hover:bg-primary cursor-pointer transition-all duration-200"
                variant="outline"
                size="icon"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-6 w-3/5">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                <span className="sr-only">Toggle menu</span>
              </SheetDescription>
              <ThemeChanger />
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium hover:text-primary hover:translate-x-1.5 transition-all duration-300 "
                    onClick={() => setOpen(false)}
                  >
                    <span className="">{link.label}</span>
                  </Link>
                ))}
                <Button asChild className="mt-4" onClick={() => setOpen(false)}>
                  <Link href="#contact">Get a Quote</Link>
                </Button>
                
              </div>
            </SheetContent>
          </Sheet>
          </div>
          
        </div>
      </div>
    </header>
  );
}
