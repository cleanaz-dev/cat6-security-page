import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


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
  icons: {
    icon: "/app/favicon.ico", // Path relative to the `public/` folder
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={orbitron.className}>
          <ThemeProvider>
            {children}
            <Toaster richColors="true" theme="system" position="top-center"/>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
