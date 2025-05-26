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
      { text: "4 HD cameras", included: true },
      { text: "Basic NVR system", included: true },
      { text: "Mobile app access", included: true },
      { text: "Professional installation", included: true },
      { text: "2-year warranty", included: true },
      { text: "Motion detection alerts", included: true },
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
      { text: "2-year warranty", included: true },
      { text: "Advanced motion detection", included: true },
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
    price: "From $99/camera",
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
Customer Name: {{firstname}} {{lastname}}
Phone Number: {{phone}}
Email Address: {{email}}

CONVERSATION FLOW - Ask questions naturally based on their responses:

1. OPENING: Start with rapport and understand their motivation
   - "I’d love to understand what’s prompting you to consider a CCTV system at this time—what’s been on your mind regarding security?"
   - "What recent experiences or concerns have made you think about upgrading or installing CCTV?"

2. GATHER BASICS (only ask what you don't know):
   - Project Type: "Is this for your home or a business?"
   
   - Camera Count with recommendations:
     * If RESIDENTIAL: For most homes, I typically recommend starting with at least 4 cameras to cover the key entry points and vulnerable areas. What sounds right for your property?"
     ***Then ask if need any special features? like 2 way audio or face detection***
     * If COMMERCIAL: "What's your thinking on camera count? For most businesses, I usually suggest 4 to 8 cameras depending on the size and layout. Does that range make sense for your space?"
     ***Then ask if they have open ceilings***
   - City: "Which city are you located in?"
   - Budget: "What budget range works for you?"
   - Timeline: "When are you looking to get this done?"
   - Features: "Any specific features in mind like mobile access or night vision?"


SPECIAL OFFER (present near end): 
"If you're ready to move forward, I have something exclusive for this call - put down a $500 deposit today and you'll get an entire year of free maintenance and emergency support. We can send you the offer via email?"

If accepted: "Perfect! I'll send you an email with all the deposit details right after this call."

Keep the tone upbeat, consultative, and focused on solving their problems.


Example Dialogue:
Person: Hi, how can I help you?
You: Hey {{customerName}}, {{yourName}} here from Cat6 Security. How’s your day going?
Person: Not bad, thanks.
You: Awesome! So tell me, what's driving the need for cameras right now?
Person: We've had some break-ins in the neighborhood lately.
You: Oh man, that's really unsettling. Is this for a residential property?
Person: Yeah, residential.
You: ( recommend # of cameras). And what's your comfort zone budget-wise?
Person: Probably around 3 to 5 thousand.
You: Perfect, that gives us good flexibility. When would you ideally want this installed?
Person: As soon as possible, honestly.
You: Where would the install be taking place? (what city).
Person: Toronto, Ontario.
You: Ok great! Absolutely doable. Look, I'd love to get one of our tech specialists out to design the perfect layout for you. And here's something I can only offer on this call - if you secure your spot with a $500 deposit today, I'll throw in a full year of free maintenance and emergency support. We can send you the offer via email and also next steps to get a tech onsite.
Person: Ok sounds good!
You: Thanks for your time and hava a great day!
END CALL

`;

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