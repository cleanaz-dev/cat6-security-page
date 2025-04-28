// components/SpeakWithRep.jsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Shield } from "lucide-react";
import { Gem } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ThemeChanger } from "@/lib/hooks/useTheme";

export default function SpeakWithRep({ contact, project, redisId }) {
  const { name, email, phone } = contact;
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const timeFrames = [
    { value: "0", label: "Now" },
    { value: "10", label: "10 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ];

  const handleMakeCall = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      setStatus({
        error: "Please select a time frame",
        loading: false,
        success: false,
      });
      return;
    }
    setStatus({ loading: true, error: null, success: false });
    try {
      const response = await fetch("/api/call/make", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contact,
          ...project,
          redisId: redisId,
          selectedTime: parseInt(selectedTime),
        }),
      });
      if (!response.ok) throw new Error("Failed to make call");
      setStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-muted to-background flex flex-col">
      <header className="text-center py-4 md:py-8 bg-primary">
        <h1 className="text-3xl lg:text-6xl flex gap-2 items-center justify-center">
          <Shield className="size-8 lg:size-16 " />
          <span className="tracking-widest font-semibold">Cat6 Security</span>
        </h1>
      </header>

      <div className="container mx-auto flex-1">
        <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-12 px-4 py-4 mb-8">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src="https://res.cloudinary.com/dmllgn0t7/image/upload/v1745701697/speak-to-rep-1_fgjtzh.png"
              alt="AI Security Representative"
              width={500}
              height={500}
              className="shadow-xl w-full max-w-md mx-auto lg:max-w-none"
              priority
            />
          </div>

          {/* Right Column - Booking Form */}
          <div className="w-full lg:w-1/2">
            <div className="h-6 mb-4">
              {status.success && (
                <div className="text-center text-green-600 mb-4">Success</div>
              )}
              {status.error && (
                <div className="text-center text-red-600 mb-4">{status.error}</div>
              )}
            </div>
            <div className="bg-primary p-8 rounded-xl shadow-md">
              <h1 className="text-3xl font-bold  mb-2">
              Speak with a Representative today!
              </h1>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="space-y-2 md:w-1/2">
                    <Label>Your Email</Label>
                    <Input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-2 bg-muted"
                    />
                  </div>
                  <div className="space-y-2 md:w-1/2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={phone}
                      readOnly
                      className="w-full px-4 py-2 bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeFrames.map((timeFrame, index) => (
                      <Button
                        key={index}
                        type="button"
                        className={`flex-1 bg-foreground text-background hover:bg-secondary transition-all duration-200 cursor-pointer ${
                          selectedTime === timeFrame.value ? "bg-secondary" : ""
                        }`}
                        onClick={() => setSelectedTime(timeFrame.value)}
                      >
                        {timeFrame.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full bg-accent hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors cursor-pointer"
                  onClick={handleMakeCall}
                  disabled={status.loading || status.success}
                >
                  {status.loading ? "Calling..." : 
                  status.success? "Call Booked!" : 
                  "Speak with a Representative"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4 ">
        <footer className="text-xs md:text-sm flex justify-center items-center gap-1 text-muted-foreground py-4 border-t">
          powered by <span className="text-primary font-bold">LLM GEM</span>
          <Gem className="size-4 md:size-4 text-primary" />
        </footer>
      </div>
    </div>
  );
}
