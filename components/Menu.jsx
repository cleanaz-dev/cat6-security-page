"use client";
import {
  Home,
  ClipboardList,
  Contact,
  Receipt,
  Shield,
  Handshake,
} from "lucide-react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { ThemeChanger } from "@/lib/hooks/useTheme";

export default function Menu({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [

    { name: "Quotes", href: "/quotes", icon: ClipboardList },
    { name: "Contacts", href: "/contacts", icon: Contact },
    { name: "Invoices", href: "/invoices", icon: Receipt },
    { name: "Team", href: "/team", icon: Handshake },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/home" className="text-xl font-bold text-background">
          <div className="flex gap-1 items-center">
            <span>
              <Shield className="size-6" />
            </span>
            <p className="">Cat6 Security</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-background">
          <div className="bg-background p-0.5 rounded-full opacity-50">
          <ThemeChanger />
          </div>
         
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors px-2 py-1.5 hover:bg-primary-muted duration-200"
            >
              {item.name}
            </Link>
          ))}
          <UserButton />
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex gap-1 items-center">
                    <span>
                      <Shield className="size-6" />
                    </span>
                    <p className="">Cat6 Security</p>
                  </div>
                </SheetTitle>
                <SheetDescription>
               
                </SheetDescription>
              </SheetHeader>
             
              <nav className="mt-8 flex flex-col gap-4 px-8 ">
              <div>
              <ThemeChanger />
              </div>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group"
                  >
                    <span className="flex gap-2 items-center py-4 px-2 group-hover:translate-x-2 transition-all duration-300 ">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="group-hover:text-secondary transition-all duration-300">
                        {item.name}
                      </span>
                    </span>
                  </Link>
                ))}
    
              </nav>

              <div className="mt-auto p-8">
             
                <div className=" ">
                  <Button asChild>
                    <SignOutButton />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
