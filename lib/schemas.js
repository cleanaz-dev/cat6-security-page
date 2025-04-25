import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  projectType: z.string().min(1, "Please select a project type"),
  cameraCount: z.string().min(1, "Please select camera count"),
  timeline: z.string().min(1, "Please select timeline"),
  message: z.string().optional(),
  features: z.array(z.string()).optional(),
  city: z.enum([
    "Toronto",
    "Mississauga", 
    "Brampton",
    "Vaughan",
    "Markham",
    "Richmond Hill",
    "Other"
  ], {
    required_error: "Please select your city",
  }),
  customCity: z.string().optional() // For "Other" selection
}).superRefine((data, ctx) => {
  if (data.city === "Other" && !data.customCity?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customCity"],
      message: "Please specify your city"
    });
  }
});