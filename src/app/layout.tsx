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
  title: "KidsFlix 🍿 | نيتفلكس للأطفال - Free Classic Cartoons & Animations",
  description:
    "Watch 100% free classic animation and cartoons for kids powered by Internet Archive. Popeye, Superman, Big Buck Bunny, Sintel, Gulliver's Travels and more in high quality with zero ads.",
  keywords: [
    "Kids Netflix",
    "نيتفلكس للأطفال",
    "Internet Archive cartoons",
    "Free kids movies",
    "Classic animations",
    "Popeye",
    "Cartoons for kids",
    "Public domain animation",
  ],
  authors: [{ name: "KidsFlix" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${fredoka.variable}`}>
      <body>{children}</body>
    </html>
  );
}
