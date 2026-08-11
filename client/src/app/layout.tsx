import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Lead Qualification Dashboard",
  description: "Automatically analyze, score, and prioritize leads using AI-powered insights and outreach suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${inter.variable} h-full antialiased`}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      <body className="min-h-full">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#10121e",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
