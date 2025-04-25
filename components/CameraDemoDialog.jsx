"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Video, Wifi, WifiOff, RotateCw, CheckCircle2 } from "lucide-react"

export function CameraDemoDialog() {
  const [connectionStatus, setConnectionStatus] = useState("idle") // idle | connecting | connected
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  // Reset when dialog closes
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetDemo()
    }
  }

  useEffect(() => {
    if (connectionStatus === "connecting") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setConnectionStatus("connected");
            return 100;
          }
          // Corrected random increment with proper rounding
          const increment = Math.floor(Math.random() * 50 + 5);
          return Math.min(prev + increment, 100); // Ensures we never exceed 100
        });
      }, 300);
  
      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const startConnection = () => {
    setConnectionStatus("connecting")
    setProgress(0)
  }

  const resetDemo = () => {
    setConnectionStatus("idle")
    setProgress(0)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="border-2 hover:bg-background/80 cursor-pointer">
          <Video className="h-5 w-5 mr-2" />
          View Demo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Live Camera Demo
          </DialogTitle>
          <DialogDescription>
            Experience our surveillance system interface
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connection Simulation */}
          <div className="flex flex-col items-center justify-center space-y-3 p-4 md:p-6 bg-muted/50 rounded-lg">
            {connectionStatus === "idle" && (
              <>
                <div className="relative">
                  <WifiOff className="h-12 w-12 text-muted-foreground" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
                </div>
                <p className="text-center">Demo system ready to connect</p>
                <Button onClick={startConnection} className="mt-4 cursor-pointer">
                  Connect to Cameras
                </Button>
              </>
            )}

            {connectionStatus === "connecting" && (
              <>
                <div className="relative">
                  <Wifi className="h-12 w-12 text-primary" />
                 
                </div>
                <p className="text-center">Establishing secure connection...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{Math.min(progress, 100)}%</span>
              </>
            )}

            {connectionStatus === "connected" && (
              <>
                <div className="relative">
                  <Wifi className="hidden md:block md:size-12 text-green-500" />
             
                </div>
                <p className="hidden md:block text-center font-medium">Connection established successfully!</p>
                
                {/* Simulated Camera Grid */}
                <div className=" mt-4 w-full">
                 
                    <div className="relative aspect-video bg-black rounded-md border border-border overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground text-sm">
                          <p>Camera 1</p>
                          <p className="text-xs text-green-400 flex items-center justify-center">
                            <span className="h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse" />
                            LIVE
                          </p>
                        </div>
                      </div>
                      {/* Simulated camera movement */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="animate-pan absolute h-full w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </div>
                    </div>
               
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}