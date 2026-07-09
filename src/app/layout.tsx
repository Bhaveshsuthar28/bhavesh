import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhavesh Suthar | AI/ML Engineer & Backend Developer",
  description: "B.Tech AI & Data Science @ GSV. Building production systems: from BCAS-compliant infra at Airports Authority of India to real-time video intelligence pipelines.",
  keywords: ["Bhavesh Suthar", "Bhavesh Jangid", "AI Engineer", "ML Engineer", "Backend Developer", "Gati Shakti Vishwavidyalaya", "Airports Authority of India", "Varanasi", "Next.js Portfolio"],
  authors: [{ name: "Bhavesh Suthar" }],
  openGraph: {
    title: "Bhavesh Suthar | AI/ML Engineer & Backend Developer",
    description: "B.Tech AI & Data Science student building high-performance systems and CV/ML pipelines.",
    type: "website",
    url: "https://bhavesh-suthar.dev", // Fallback production URL
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary selection:bg-accent selection:text-bg-primary">
        {children}
      </body>
    </html>
  );
}

