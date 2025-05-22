import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({
  subsets: ["latin"],
  weightRange: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
  preload: true,
  autoReplace: true,
});

export const metadata = {
  title: "Cat6 Security | Expert CCTV & Security Camera Installation",
  description:
    "Professional security camera installation for homes & businesses. High-quality CCTV systems, smart home integration, and 24/7 monitoring solutions.",
  icons: { icon: "/favicon.ico" },

  // Add this to ensure indexing:
  robots: {
    index: true, // Allow search engines to index this page
    follow: true, // Allow crawling links on the page
    nocache: false, // Optional: Prevents caching if true
  },

  // Optional: Set canonical URL (good for SEO)
  alternates: {
    canonical: "https://cat6security.com", // Replace with your actual domain
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={orbitron.className}>
          <ThemeProvider>
            {children}
            <Toaster richColors="true" theme="system" position="top-center" />
          </ThemeProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
