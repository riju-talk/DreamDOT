import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google"; // Removed Playfair
import "./globals.css";
import { SessionContextProvider } from "./session-contect";
import { Toaster } from "@/components/ui/sonner";
import { BetaBanner } from "@/components/beta-banner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans", // Using font-sans for Inter to replace default
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DreamDOT",
  description: "An online content monetization social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <SessionContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BetaBanner />
            <Toaster />
            {children}
          </ThemeProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
