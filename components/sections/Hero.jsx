"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg1 from "@/public/images/hero-1.png";
import heroImg2 from "@/public/images/hero-2.png";
import heroImg3 from "@/public/images/hero-3.png";
import { CameraDemoDialog } from "../CameraDemoDialog";

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [heroImg1, heroImg2, heroImg3];
  const transitionDuration = 5

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden bg-gradient-to-b from-primary/90 to-primary/50"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto py-12 md:py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Mobile & Medium (md) view */}
          <div className="lg:hidden relative">
            {/* Shield badge */}
            <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-primary/90 to-primary/50 border border-white/30 w-fit text-white z-20">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">24/7 Protection</span>
            </div>

            {/* Image container - responsive height for md */}
            <div className="w-full h-[300px] md:h-[450px] overflow-hidden relative">
              <div className="absolute inset-0 animate-slow-scale">
              <AnimatePresence mode="popLayout" initial={false}>
                {images.map((img, index) => (
                  index === currentImage && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: transitionDuration,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={img}
                        alt={`Security System ${index + 1}`}
                        className="object-cover"
                        fill
                        priority
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              </div>
            </div>

            {/* Bottom text overlay - enhanced for md */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 md:p-6 text-white z-10">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                Professional Security Camera Installation
              </h1>
              <p className="hidden md:block mt-2 text-sm md:text-lg md:max-w-[80%]">
                Advanced surveillance systems tailored to protect your home and business.
              </p>
            </div>
          </div>

          {/* Desktop text content - also adjusted for xl screens */}
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full border border-border w-fit">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">24/7 Protection</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl/none xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Professional Security <br className="hidden md:block" />
                <span className="text-primary">Camera Installation</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl xl:text-2xl">
                Advanced surveillance systems tailored to protect your home and
                business with cutting-edge technology.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
              <Button
                asChild
                size="lg"
                className="group shadow-lg hover:shadow-primary/20 transition-shadow"
              >
                <Link href="#contact" className="flex items-center gap-1">
                  Get Free Consultation
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <CameraDemoDialog />
            </div>
          </div>

          {/* Desktop image with modern frame */}
          <div className="hidden lg:flex relative items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl -rotate-6 transform -translate-x-2 -translate-y-2" />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-3 transform translate-x-2 translate-y-2" />
            <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 z-10" />
              <Image
                src={heroImg1}
                width={600}
                height={600}
                alt="Security Camera System"
                className="relative z-0 object-cover object-center transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>

        {/* Buttons for mobile & md */}
        <div className="lg:hidden flex flex-col gap-3 min-[400px]:flex-row pt-6 justify-center">
          <Button
            asChild
            size="lg"
            className="group shadow-lg hover:shadow-primary/20 transition-shadow w-full min-[400px]:w-auto"
          >
            <Link href="#contact" className="flex items-center gap-1">
              Get Free Consultation
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <CameraDemoDialog />
        </div>
      </div>
    </section>
  );
}