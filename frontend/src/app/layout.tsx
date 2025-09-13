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
  title: "Real Estate Price Guessing Game | AI-Powered Property Game",
  description: "Challenge yourself with AI-powered real estate price prediction! Search 43K+ properties using natural language and guess hidden prices. Win Gold, Silver, or Bronze medals!",
  keywords: "real estate, property, price guessing, AI, game, California, Georgia, house prices",
  authors: [{ name: "Real Estate Game Team" }],
  creator: "Real Estate Game",
  publisher: "Real Estate Game",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Real Estate Price Guessing Game",
    description: "AI-powered real estate price prediction game with 43K+ properties",
    url: "http://localhost:3000",
    siteName: "Real Estate Game",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Real Estate Price Guessing Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Price Guessing Game",
    description: "AI-powered real estate price prediction game",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
