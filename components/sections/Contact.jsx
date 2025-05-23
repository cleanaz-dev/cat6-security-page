"use client";
import { useState } from "react";
import { HelpCircle, CheckCheck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  features,
  numOfCameras,
  projectTypes,
  timeline,
  cities,
  budgets,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { ContactFormSchema } from "@/lib/schemas";
import { SuccessDialog } from "@/components/SuccessDialog";

export default function Contact() {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  // const [hoveredFeature, setHoveredFeature] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    control, // Added for Controller
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      // budget: "",
      phone: "",
      city: "",
      // customCity: "",
      // projectType: "",
      // cameraCount: "",
      // timeline: "",
      message: "",
      // features: [],
    },
  });

  // const handleFeatureToggle = (featureValue) => {
  //   const newFeatures = selectedFeatures.includes(featureValue)
  //     ? selectedFeatures.filter((f) => f !== featureValue)
  //     : [...selectedFeatures, featureValue];
  //   setSelectedFeatures(newFeatures);
  //   setValue("features", newFeatures);
  // };

  // const removeFeature = (featureValue) => {
  //   const newFeatures = selectedFeatures.filter((f) => f !== featureValue);
  //   setSelectedFeatures(newFeatures);
  //   setValue("features", newFeatures);
  // };

  const onSubmit = async (data) => {
    // console.log("Form data:", data);
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      setSuccessDialogOpen(true);
      reset();
      setSelectedFeatures([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
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
            {/*             
            <Alert className="mb-6">
              <MapPin className="h-4 w-4" />
              <AlertTitle>Serving All GTA Areas</AlertTitle>
              <AlertDescription>
                Toronto • Mississauga • Brampton • Vaughan • Markham • Richmond Hill
              </AlertDescription>
            </Alert> */}

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
            <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-lg">
              <div className="grid gap-4">
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

                {/* City Selector */}
                {/* <div className="space-y-2">
                  <Label htmlFor="city-select">City</Label>
                  <Controller
                    id="city"
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="city"
                        name="city"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="city-select">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.city && (
                    <p className="text-sm text-rose-500">
                      {errors.city.message}
                    </p>
                  )}

                  {watch("city") === "Other" && (
                    <div className="mt-2">
                      <Label htmlFor="custom-city-input">Specify City</Label>
                      <Input
                        {...register("customCity")}
                        placeholder="Enter your city"
                      />
                      {errors.customCity && (
                        <p className="text-sm text-rose-500">
                          {errors.customCity.message}
                        </p>
                      )}
                    </div>
                  )}
                </div> */}

                {/* Budget */}
                {/* <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Select
                    id="budget"
                    name="budget"
                    onValueChange={(value) => setValue("budget", value)}
                    value={watch("budget")}
                  >
                    <SelectTrigger id="budget" name="budget">
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {budgets.map((budget) => (
                        <SelectItem key={budget.id} value={budget.value}>
                          {budget.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <p className="text-sm text-rose-500">
                      {errors.budget.message}
                    </p>
                  )}
                </div> */}

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

                {/* Sales-Focused Selects */}
                {/* <div className="grid md:grid-cols-2 gap-4"> */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      id="projectType"
                      name="projectType"
                      onValueChange={(value) => setValue("projectType", value)}
                      value={watch("projectType")}
                    >
                      <SelectTrigger id="projectType" name="projectType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.projectType && (
                      <p className="text-sm text-rose-500">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div> */}
                  {/* Camera Count */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="camera-count">Estimated Cameras</Label>
                    <Select
                    id="camera-count" name="camera-count"
                      onValueChange={(value) => setValue("cameraCount", value)}
                      value={watch("cameraCount")}
                    >
                      <SelectTrigger id="camera-count" name="camera-count">
                        <SelectValue placeholder="Choose amount" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {numOfCameras.map((camera) => (
                          <SelectItem key={camera.value} value={camera.value}>
                            {camera.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cameraCount && (
                      <p className="text-sm text-rose-500">
                        {errors.cameraCount.message}
                      </p>
                    )}
                  </div> */}
                {/* </div> */}

                {/* Timeline */}
                {/* <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline to Install</Label>
                    <Select
                      id="timeline" name="timeline"
                      onValueChange={(value) => setValue("timeline", value)}
                      value={watch("timeline")}
                    >
                      <SelectTrigger id="timeline" name="timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {timeline.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeline && (
                      <p className="text-sm text-rose-500">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="special-features">Special Features</Label>
                    <Select 
                      id="special-features"
                        name="special-features"
                    onValueChange={handleFeatureToggle}>
                      <SelectTrigger
                        id="special-features"
                        name="special-features"
                      >
                        <SelectValue placeholder="Any priorities?" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {features.map((feature) => (
                          <SelectItem key={feature.value} value={feature.value}>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedFeatures.includes(
                                  feature.value
                                )}
                                readOnly
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span>{feature.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}

                {/* Selected Features Display */}
                {/* {selectedFeatures.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Features</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((featureValue) => {
                        const feature = features.find(
                          (f) => f.value === featureValue
                        );
                        return (
                          <Badge
                            key={featureValue}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {feature?.label}
                            <Button
                              size="xs"
                              type="button"
                              onClick={() => removeFeature(featureValue)}
                              className="rounded-full hover:bg-transparent bg-transparent text-primary cursor-pointer"
                              onMouseEnter={() =>
                                setHoveredFeature(featureValue)
                              }
                              onMouseLeave={() => setHoveredFeature(null)}
                            >
                              {hoveredFeature === featureValue ? (
                                <X className="size-3" />
                              ) : (
                                <CheckCheck className="size-3" />
                              )}
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )} */}

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
                className="w-full cursor-pointer"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>

              {success && (
                <div className="text-green-500 text-center">
                  Form submitted successfully!
                </div>
              )}
              {error && (
                <div className="text-rose-500 text-center">{error}</div>
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
