import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foodzy | Order Food Online",
  description: "Experience the best food delivery app with professional Foodzy-like interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background pb-16 md:pb-0`}
      >

        <Navbar />
        <main className="pt-20 min-h-[calc(100vh-64px)]">{children}</main>
        <BottomNav />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
