import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  budget: z.string().min(1, "Please select a budget"),
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

export const AddNewContactSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname:z.string().min(1, "Last name be at least 1 character"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().min("Please enter valid email")
})

export const InstallSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  client: z.object({
    hs_object_id: z.string(),
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }),
  address: z.string().min(1, "Address required"),
  start: z.date(),
  technician: z.array(z.string()).min(1, "Select at least one technician"),
  notes: z.string().optional(),
  status:z.string().optional(),
  jobType: z.string().optional(),
  end: z.date().optional()
})

export const NewTicketSchema = z.object({
  client: z.object({
    hs_object_id: z.string(),
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).refine((val) => !!val.hs_object_id, {
    message: "Please select a client",
  }),
  priority: z.string().min(1, "Please select a priority"),
  subject: z.string().min(1, "Please enter a subject"),
  issue: z.string().min(20, "Issue must be at least 20 characters" ),
  installId: z.string().min(1, "Please select related Install")
})