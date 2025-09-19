import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Political Alignment Quiz - Compare Your Views",
  description: "Discover how closely your political views align with Charlie Kirk's positions through our comprehensive 10-question quiz. See your results and compare with other participants.",
  openGraph: {
    title: "Political Alignment Quiz - Compare Your Views",
    description: "Take a 10-question political quiz to see how your views align with Charlie Kirk's positions. Get detailed results and share with friends!",
    url: "https://charlie-kirk-political-alignment-quiz.vercel.app",
    siteName: "Political Alignment Quiz",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?percentage=75&sessionId=demo",
        width: 1200,
        height: 630,
        alt: "Political Alignment Quiz - Test Your Views",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Political Alignment Quiz - Compare Your Views",
    description: "Take a 10-question political quiz to see how your views align with Charlie Kirk's positions.",
    creator: "@jonahliu0426",
    images: ["/api/og?percentage=75&sessionId=demo"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
