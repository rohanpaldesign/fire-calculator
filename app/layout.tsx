import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIRE Calculator - Financial Independence, Retire Early",
  description: "Calculate your FIRE number, Coast FIRE, Lean FIRE, Fat FIRE, and path to financial independence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Tooltip.Provider>
            {children}
          </Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
