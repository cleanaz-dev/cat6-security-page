import { Button } from "@/components/ui/button";
import { ShieldAlert, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function InvalidTokenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex flex-col">
      {/* Header */}
      <header className="py-6 border-b border-muted">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">Cat6 Security</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-background p-8 rounded-xl shadow-sm border border-muted text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 " />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-3">Invalid or Expired Link</h1>
          
          <p className="text-muted-foreground mb-6">
            The verification link you used is either invalid or has expired. 
            Please request a new link or contact our support team for assistance.
          </p>

          <div className="space-y-3">
            <Button className="w-full" disabled>
              <Link href="/request-new-link">
                Request New Verification Link
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <a 
                href="mailto:support@cat6security.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              
              <a 
                href="tel:+15551234567" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-muted">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}