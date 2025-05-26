"use client";
import { useState } from "react";
import { HelpCircle, CheckCheck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import rep2 from "@/public/images/speak-to-rep-1.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { ContactFormSchema } from "@/lib/schemas";
import { SuccessDialog } from "@/components/SuccessDialog";
import Image from "next/image";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Add this import
import { UserCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [initiatingCall, setInitiatingCall] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const { push } = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      city: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Your existing form submission logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // After successful submission:
      setSubmittedData(data);
      setFormSubmitted(true);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeSelection = async (timeOption) => {
    setInitiatingCall(true);
    setError("");
    let uuid = crypto.randomUUID();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch("/api/call/make", {
        method: "POST", // Add the HTTP method
        headers: {
          "Content-Type": "application/json", // Correct capitalization
        },
        body: JSON.stringify({
          // Use JSON.stringify to properly format the body
          ...submittedData,
          timeOption: timeOption,
          uuid: uuid,
        }),
      });

      const data = await response.json(); // Parse the response

      if (data.success) {
        // Check the parsed data, not the response object

        push(`/thank-you/${uuid}`); // Use router.push instead of push
      } else {
        setError(data.message || "Failed to schedule call. Please try again.");
      }
    } catch (error) {
      console.error("Error scheduling call:", error);
      setError("Failed to schedule call. Please try again.");
    } finally {
      setInitiatingCall(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const slideVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.7,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section
      id="contact"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/90 to-primary/50"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Left Side Info */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-6xl font-bold tracking-tighter md:text-4xl/tight">
                Contact Us
              </h2>
              <p className="max-w-[600px] text-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ready to enhance your security? Get in touch with our team for a
                free consultation and quote.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="self-start rounded-full bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Business Hours</h3>
                  <p className="text-muted">Monday - Friday: 8am - 8pm</p>
                  <p className="text-muted">Saturday: 9am - 5pm</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="self-start rounded-full bg-primary/10 p-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Support</h3>
                  <p className="text-muted">
                    24/7 emergency support for existing customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-lg min-h-[550px] overflow-x-hidden">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="form"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Original Form Fields */}
                    <div className="grid gap-4">
                      <h1 className="text-center text-xl decoration-primary underline mb-6">
                        Speak to a Rep Now!
                      </h1>
                      {/* Name Inputs */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">First Name</Label>
                          <Input
                            id="firstname"
                            name="firstname"
                            {...register("firstname")}
                            placeholder="John"
                            autoComplete="on"
                          />
                          {errors.firstname && (
                            <p className="text-sm text-rose-500">
                              {errors.firstname.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Last Name</Label>
                          <Input
                            id="lastname"
                            name="lastname"
                            {...register("lastname")}
                            placeholder="Doe"
                            autoComplete="on"
                          />
                          {errors.lastname && (
                            <p className="text-sm text-rose-500">
                              {errors.lastname.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          {...register("email")}
                          placeholder="john.doe@example.com"
                          autoComplete="on"
                        />
                        {errors.email && (
                          <p className="text-sm text-rose-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          {...register("phone")}
                          placeholder="(123) 456-7890"
                          autoComplete="on"
                        />
                        {errors.phone && (
                          <p className="text-sm text-rose-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          {...register("message")}
                          placeholder="Provide more information if you'd like..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer mt-4"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  </motion.div>
                ) : showTimeSelection ? (
                  <motion.div
                    key="time-selection"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <div className="relative h-32 w-32 mx-auto mb-4">
                        <Image
                          src={rep2}
                          alt="Representative"
                          fill
                          className="object-cover rounded-full"
                          priority
                        />
                      </div>
                      <h2 className="text-2xl font-bold">
                        When would you like to speak?
                      </h2>
                      <p className="text-muted-foreground">
                        Choose when you'd like to receive your call
                      </p>
                    </div>

                    {/* Time Options */}
                    <div className="space-y-3">
                      {[
                        {
                          value: 0,
                          label: "Right Now",
                          description: "Call me immediately",
                          icon: Phone,
                        },
                        {
                          value: 5,
                          label: "In 5 Minutes",
                          description: "Perfect for a quick prep",
                          icon: Clock,
                        },
                        {
                          value: 30,
                          label: "In 30 Minutes",
                          description: "Give me some time to prepare",
                          icon: Clock,
                        },
                        // { value: '1hr', label: 'In 1 Hour', description: 'I need an hour to get ready', icon: Clock }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            let timeOption;
                            if (option.value === 0) {
                              timeOption = new Date().toISOString(); // Current time, rounded to minute
                            } else {
                              const futureTime = new Date(
                                Date.now() + option.value * 60 * 1000
                              );
                              futureTime.setSeconds(0, 0); // Round to the nearest minute
                              timeOption = futureTime.toISOString(); // Convert to ISO string
                            }
                            handleTimeSelection(timeOption);
                          }}
                          className="w-full p-4 border-2 border-muted rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 text-left group cursor-pointer"
                          disabled={initiatingCall}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <option.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">
                                {option.label}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Loading State */}
                    {initiatingCall && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-2"
                      >
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Setting up your call...
                        </p>
                      </motion.div>
                    )}

                    {/* Back Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTimeSelection(false)}
                      className="w-full"
                      disabled={initiatingCall}
                    >
                      Back to Contact Info
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-call"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-x-hidden"
                  >
                    {/* Mobile-first layout */}
                    <div className="flex flex-col bg-background overflow-hidden">
                      {/* Image Section (Full width) */}
                      <div className="relative h-64 w-full">
                        <Image
                          src={rep2}
                          alt="Representative"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
                        <div className="absolute top-4 left-0 right-0 text-center">
                          <h1 className="text-2xl font-bold text-white drop-shadow-md">
                            Book Call Now!
                          </h1>
                        </div>
                      </div>

                      {/* Contact Card (Below image on mobile) */}
                      <motion.div
                        className="mx-4 transform -translate-y-6 z-10"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: -24, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="bg-background border border-muted rounded-lg shadow-lg overflow-hidden">
                          <div className="bg-primary px-4 py-3">
                            <div className="flex items-center gap-2">
                              <UserCircle className="size-5 text-primary-foreground" />
                              <h3 className="text-primary-foreground font-medium text-sm">
                                Contact Information
                              </h3>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            {/* Name */}
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Name
                              </p>
                              <p className="text-sm font-medium">
                                {submittedData.firstname}{" "}
                                {submittedData.lastname}
                              </p>
                            </div>

                            {/* Phone */}
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Phone
                              </p>
                              <p className="text-sm font-medium">
                                {submittedData.phone}
                              </p>
                            </div>

                            {/* Email */}
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Email
                              </p>
                              <p className="text-sm font-medium truncate">
                                {submittedData.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Buttons */}
                      <motion.div
                        className="px-4 pb-4 pt-2 bg-background"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="space-y-2 flex flex-col">
                          <Button
                            type="button"
                            onClick={() => setShowTimeSelection(true)}
                            className="w-full gap-2 py-3 text-base"
                          >
                            <Phone className="size-4" />
                            Book Call Now!
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFormSubmitted(false);
                              setSubmitting(false);
                            }}
                            className="w-full py-3 text-base"
                          >
                            Book Call Later
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  className="text-rose-500 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
            </div>

            <SuccessDialog
              open={successDialogOpen}
              onClose={() => setSuccessDialogOpen(false)}
              city={watch("city")}
            />
          </form>
        </div>
      </div>
    </section>
  );
}
