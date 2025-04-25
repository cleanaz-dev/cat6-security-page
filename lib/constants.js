import { Shield, LockKeyhole, Cctv, Hammer } from "lucide-react";

// ************ CONTACT  ************

const features = [
  { label: "Remote Viewing", value: "remote-viewing" },
  { label: "POS Integration", value: "pos-integration" },
  { label: "AI Threat Detection", value: "ai-detection" },
  { label: "Two-way Audio", value: "two-way-audio" },
  { label: "Upgrade Existing System", value: "upgrade-existing-system" },
];

const projectTypes = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Rental Property", value: "rental-property" },
  { label: "Mixed Use", value: "mixed-use" },
];

const numOfCameras = [
  { label: "1-4", value: "1-4" },
  { label: "4-8", value: "4-8" },
  { label: "8-16", value: "8-16" },
  { label: "More than 16", value: "+16" },
];

const timeline = [
  { label: "ASAP", value: "asap" },
  { label: "1-2 weeks", value: "weeks" },
  { label: "Within 1 month", value: "month" },
  { label: "Just Looking/Planning", value: "tba" },
];
const cities = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham",
  "Richmond Hill",
  "Other",
];

export { features, projectTypes, numOfCameras, timeline, cities };

// ************ END CONTACT  ************

// ************ PRICING  ************

const pricingPlans = [
  {
    id: 1,
    name: "Basic",
    description: "For small homes and apartments",
    price: "599",
    isCustom: false,
    isPopular: false,
    features: [
      { text: "2-4 IP cameras", included: true },
      { text: "Basic NVR system", included: true },
      { text: "Mobile app access", included: true },
      { text: "Professional installation", included: true },
      { text: "1-year warranty", included: true },
      { text: "Motion detection alerts", included: false },
      { text: "Cloud storage", included: false },
    ],
    buttonVariant: "outline",
  },
  {
    id: 2,
    name: "Standard",
    description: "For homes and small businesses",
    price: "999",
    isCustom: false,
    isPopular: false,
    features: [
      { text: "4-8 IP cameras", included: true },
      { text: "Advanced NVR system", included: true },
      { text: "Mobile & web access", included: true },
      { text: "Professional installation", included: true },
      { text: "2-year warranty", included: true },
      { text: "Motion detection alerts", included: true },
      { text: "Cloud storage", included: false },
    ],
    buttonVariant: "default",
  },
  {
    id: 3,
    name: "Premium",
    description: "For businesses and large properties",
    price: "1,899",
    isCustom: false,
    isPopular: true,
    features: [
      { text: "8-16 IP cameras", included: true },
      { text: "Enterprise NVR system", included: true },
      { text: "Multi-user access", included: true },
      { text: "Professional installation", included: true },
      { text: "3-year warranty", included: true },
      { text: "Advanced motion detection", included: true },
      { text: "30-day cloud storage", included: true },
    ],
    buttonVariant: "default",
  },
  {
    id: 4,
    name: "Enterprise",
    description: "For large commercial properties",
    price: "Custom",
    isCustom: true,
    isPopular: false,
    features: [
      { text: "+16 IP cameras", included: true },
      { text: "Custom server solutions", included: true },
      { text: "Advanced access control", included: true },
      { text: "Professional installation", included: true },
      { text: "3-year warranty", included: true },
      { text: "AI-powered analytics", included: true },
      { text: "Unlimited cloud storage", included: true },
    ],
    buttonVariant: "outline",
    buttonText: "Contact Sales",
  },
];

const additionalServices = [
  {
    id: 1,
    name: "Maintenance Plan",
    price: "From $19/month",
  },
  {
    id: 2,
    name: "Extended Warranty",
    price: "From $99/year",
  },
  {
    id: 3,
    name: "Remote Monitoring",
    price: "From $49/month",
  },
  {
    id: 4,
    name: "System Upgrade",
    price: "Custom pricing",
  },
  {
    id: 5,
    name: "Additional Cameras",
    price: "From $199/camera",
  },
  {
    id: 6,
    name: "Emergency Support",
    price: "From $29/month",
  },
];

export { pricingPlans, additionalServices };

// ************ END PRICING  ************

// ************ SERVICES  ************

const services = [
  {
    title: "Professional Installation",
    description:
      "Our certified technicians ensure proper installation and optimal camera placement.",
  },
  {
    title: "System Configuration",
    description:
      "Complete setup of your security system including network configuration and mobile access.",
  },
  {
    title: "Maintenance & Support",
    description:
      "Ongoing technical support and maintenance plans to keep your system running smoothly.",
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored security systems designed specifically for your property and security needs.",
  },
  {
    title: "Remote Monitoring",
    description:
      "Access your security footage from anywhere with our mobile and web applications.",
  },
  {
    title: "System Upgrades",
    description:
      "Upgrade existing systems with the latest technology and additional cameras.",
  },
];

export { services };

// ************ END SERVICES  ************

// ************ PRODUCTS ************
const products = [
  {
    id: 1,
    title: "4K Security Cameras",
    description:
      "High-definition cameras with night vision and weather-resistant features.",
    icon: Cctv,
  },
  {
    id: 2,
    title: "NVR Systems",
    description:
      "Network Video Recorders with advanced motion detection and remote viewing.",
    icon: Shield,
  },
  {
    id: 3,
    title: "Access Control",
    description:
      "Complete access control solutions for businesses and high-security areas.",
    icon: LockKeyhole,
  },
  {
    id: 4,
    title: "Vandal Proof",
    description: "Engineered to resist tampering and vandalism, ensuring reliable protection around the clock.",
    icon: Hammer,
  },
];

export { products };

// ************ END PRODUCTS  ************
