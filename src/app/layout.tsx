import type { Metadata } from "next";
import { Outfit, Fredoka } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kidsnetflix.vercel.app"),
  title: {
    default: "KidsFlix 🍿 | نيتفلكس للأطفال - Free Classic Cartoons & Animations",
    template: "%s | KidsFlix",
  },
  description:
    "Watch 140,000+ free classic animation, movies & cartoons for kids powered by Internet Archive. Popeye, Superman, games, sci-fi and retro cartoons with zero ads and strict Kid-Safe Shield protection.",
  keywords: [
    "Kids Netflix",
    "KidsFlix",
    "نيتفلكس للأطفال",
    "Internet Archive cartoons",
    "Free kids movies",
    "Classic animations",
    "Popeye cartoons",
    "Superman animated",
    "Public domain animation",
    "Safe streaming for kids",
  ],
  authors: [{ name: "KidsFlix Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "KidsFlix 🍿 | 100% Free Cartoons & Movies for Kids",
    description:
      "Stream 140,000+ classic cartoons, Popeye, Superman, games, and retro animations with zero ads and strict Kid-Safe Shield protection.",
    url: "https://kidsnetflix.vercel.app",
    siteName: "KidsFlix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KidsFlix - Free Classic Cartoons & Kids Streaming Platform",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KidsFlix 🍿 | Free Classic Cartoons & Movies for Kids",
    description:
      "Watch 140,000+ free cartoons for kids. Safe, ad-free public domain streaming.",
    images: ["/og-image.png"],
    creator: "@KidsFlix",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KidsFlix",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff2a6d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${fredoka.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ff2a6d" />
      </head>
      <body>{children}</body>
    </html>
  );
}
