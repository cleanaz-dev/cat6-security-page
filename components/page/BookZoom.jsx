"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { Shield, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { isToday } from "date-fns";


export default function BookZoom({ contact, project }) {
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);



  const { name, email, phone } = contact;
  const {
    type,
    cameraCount,
    timeline,
    message,
    features,
    city,
    customCity,
    budget,
  } = project;



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto flex-1">
        <div className="text-center py-4 md:py-10">
          <header>
            <h1 className="text-3xl flex gap-2 items-center justify-center">
              <Shield className="size-8" />{" "}
              <span className="tracking-widest">Cat6 Security</span>
            </h1>
          </header>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12 px-4 py-4 mb-8">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src="https://res.cloudinary.com/dmllgn0t7/image/upload/v1745701697/speak-to-rep-1_fgjtzh.png"
              alt="Zoom Security Consultation"
              width={500}
              height={500}
              className="shadow-xl w-full max-w-md mx-auto lg:max-w-none"
              priority
            />
          </div>

          {/* Right Column - Booking Form */}
          <div className="w-full lg:w-1/2 bg-primary p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-2">
              Schedule Your Zoom Meeting with one our Experts
            </h1>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Email</Label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-2 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Day</Label>
                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    onClick={() => setSelectedDay("today")}
                    className="flex-1 bg-foreground text-background hover:bg-secondary transition-all duration-200 cursor-pointer"
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setSelectedDay("tomorrow")}
                    className="flex-1 bg-foreground text-background hover:bg-secondary transition-all duration-200 cursor-pointer"
                  >
                    Tomorrow
                  </Button>
                </div>
              </div>
              {isToday(selectedDay) && (
                <p className="text-sm text-muted-foreground">
                  You’ve selected a same-day Zoom consultation!
                </p>
              )}

              <div className="space-y-2">
                <Label>Select Time</Label>
                <Select
                  onValueChange={(value) => setSelectedTime(value)}
                  className="bg-muted"
                >
                  <SelectTrigger className="w-full bg-muted">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectGroup>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                className="w-full bg-accent hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors cursor-pointer"
                onClick={() => (console.log("button clicked"))}
              >
                {loading ? "Scheduling..." : "Book Zoom Call"}
              </Button>
            </div>
            <div className="mt-2 -mb-2">
              {success && (
                <div className="text-center text-green-600 mb-4">
                  Zoom call scheduled successfully!
                </div>
              )}
              {error && (
                <div className="text-center text-red-600 mb-4">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <footer className="text-xs md:text-sm flex justify-center items-center gap-1 text-muted-foreground">
          powered by <span className="text-primary font-bold">LLM GEM</span>
          <Gem className="size-4 md:size-4 text-primary" />
        </footer>
      </div>
    </div>
  );
}