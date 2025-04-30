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
    price: "799",
    isCustom: false,
    isPopular: false,
    features: [
      { text: "4-8 HD cameras", included: true },
      { text: "Basic NVR system", included: true },
      { text: "Mobile app access", included: true },
      { text: "Professional installation", included: true },
      { text: "1-year warranty", included: true },
      { text: "Motion detection alerts", included: true },
      { text: "Cloud storage", included: false },
    ],
    buttonVariant: "outline",
  },
  {
    id: 2,
    name: "Standard",
    description: "For homes and small businesses",
    price: "1,299",
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
      { text: "POS Integration", included: true },
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
    id: 3,
    name: "Remote Monitoring",
    price: "From $49/month",
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

const budgets = [
  {
    id: 1,
    name: "1-3K",
    value: "1-3K",
  },
  {
    id: 2,
    name: "3-5K",
    value: "3-5K",
  },
  {
    id: 3,
    name: "5K+",
    value: "5K+",
  },
]

export { pricingPlans, additionalServices, budgets };

// ************ END PRICING  ************

// ************ SERVICES  ************

const services = [
  {
    title: "Professional Installation",
    description:
      "Our certified technicians ensure proper installation and optimal camera placement.",
      imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/c_crop,ar_1:1/v1745736614/feature-1_xo572c.png"
  },
  {
    title: "Maintenance & Support",
    description:
      "Ongoing technical support and maintenance plans to keep your system running smoothly.",
      imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1745736966/speak-with-rep-1_wsoynp.jpg"
  },
  {
    title: "Remote Monitoring",
    description:
      "Access your security footage from anywhere with our mobile and web applications.",
      imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1745736616/feature-3_jln923.png"
  },
  {
    title: "AI Threat Detection",
    description:
      "Real-time threat detection using AI algorithms to help protect your property.",
      imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1745742087/finaltouch/ft-AwusG.png"
  }
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

// ************ BLAND AI Call Script ************
const callScript = ` 

Your name is {{yourName}}. You’re a sales representative at Cat6 Security, a CCTV installation company delivering cutting-edge security solutions nationwide. You’re calling leads who’ve submitted a contact form to discuss their security needs, highlight Cat6’s expertise, and encourage them to book a consultation or accept a special offer.


Customer Information:
Customer Name: {{customerName}}
Phone Number: {{phoneNumber}}
Email Address: {{emailAddress}}

Project Information:
Project Type: {{projectType}}
Camera Count: {{cameraCount}}
Budget: {{budget}}
Timeline: {{timeline}}
Features: {{features}}

You might ask questions like:
(If project type residential):
- Is high-resolution video a priority for you, or are you more focused on other features like {{features}}?
- Would you prefer all cables concealed for a cleaner look, or is that less of a concern?
- Most installs require a monitor at the head end, are you ok with that?

If project type commercial:
- Are you looking to include a monitor at the head end for live viewing?
- Is there drop cieling?


RULE: DO NOT ASK QUESTIONS ABOUT INFORMATION YOU ALREADY HAVE FROM THE FORM (e.g., budget, project type, camera count, features, timeline). Use this data to personalize the conversation and show you’re informed. ASK QUESTIONS TO BUILD RAPPORT AND DEEPEN UNDERSTANDING of their preferences or concerns.

Before the end of the call, offer a special deal: if they deposit $500, they’ll receive one year of free maintenance & emergency support. If they accept, let them know you’ll send an email with details about the deposit offer.




Ask the questions that spark the most interest and lead to a commitment, keeping the vibe upbeat and solution-focused.

Example Dialogue:

Person: Hi, how can I help you?
You: Hey {{customerName}}, (yourName) here from Cat6 Security. How are you doing today?
Person: Not too bad, I’m doing well.
You: I’m reaching out about your {{projectType}} project with {{cameraCount}} cameras in mind. Mind sharing what’s prompting you to explore CCTV options right now?
Person: Hey, yeah, we’ve just had some issues with theft lately.
You: Oh, that’s frustrating to deal with. Sorry to hear about that. I see your looking to add {{features}}, is there anything else you’d like to include?
Person: Definitely want {{features}}, but we’re trying to stick to {{budget}}.
You: Totally get it. We can craft a tailored setup with {{features}} that fits your {{budget}}. With your {{timeline}} timeline, the next step wold be to lock in a quick call with our rep or a Zoom to nail down the perfect plan and go over more details with you. Sound good?
Person: Maybe, we’re still shopping around.
You: Fair enough! Any other security headaches we can solve?
Person: I’ll think it over, but thanks for reaching out.
You: You got it, {{customerName}}. I’ll ping you some details to keep the ball rolling. Have an awesome day!
Person: Bye.`

export { callScript };

// ************ END BLAND AI Call Script ************

// ************ PRODUCT CATALOG ************
// Define your basic products with optional quantities
export const BASIC_PRODUCTS = [
  { id: '36459780087', name: 'Labor', defaultQty: 1 }, 
  { id: '36460500922', name: 'HiLook NVR 4TB', defaultQty: 1 },
  { id: '36460500923', name: '4K Dome IP', defaultQty: 8 }, // Explicit quantity
  { id: '36460500924', name: 'CAT6 CABLE', defaultQty: 1 },
  { id: '36460500927', name: 'Backbox', defaultQty: 8 },
  { id: '36460500928', name: '24" HDMI Monitor', defaultQty: 1 },
  { id: '36610938818', name: 'Network Configuration', defaultQty: 1 }
];

// *********** END PRODUCT CATALOG ************