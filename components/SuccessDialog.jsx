// components/SuccessDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export function SuccessDialog({ 
  open,
  onClose,
  city,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">
            Thank You!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4">
          <p>
            Our {city ? `${city} team` : "team"} will contact you within 
            <span className="font-semibold"> 24 hours</span>.
          </p>
          
          <p className="text-sm text-muted-foreground">
            Please check your email for a confirmation and next steps.
          </p>

          <Button
          
            onClick={onClose} 
            className="mt-4 w-full cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}