import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Heidelberg Custom Sheds | Custom Built Sheds in Phoenix, AZ",
  description:
    "Quality custom-built sheds for Phoenix, AZ. Storage sheds, she-sheds, barn style, and more. Free quotes. Licensed & insured. 5-star rated on Yelp.",
  keywords: [
    "custom sheds phoenix",
    "shed builder phoenix",
    "storage sheds arizona",
    "she sheds phoenix",
    "barn sheds",
    "custom shed builder",
  ],
  openGraph: {
    title: "Heidelberg Custom Sheds | Custom Built Sheds in Phoenix, AZ",
    description:
      "Quality custom-built sheds for Phoenix, AZ. Storage sheds, she-sheds, barn style, and more. Free quotes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background scroll-smooth`}>
      <body className="font-sans antialiased">{children}</body>
      {process.env.NODE_ENV === "production" && <Analytics />}
    </html>
  );
}
