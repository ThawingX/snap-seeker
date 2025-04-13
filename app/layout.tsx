import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";

const inter = Inter({ subsets: ["latin"] });

// Generate site-wide metadata with a combination of keywords
export const metadata: Metadata = generateMetadata(
  seoConfig.defaultTitle,
  seoConfig.defaultDescription,
  [
    seoConfig.coreKeywords,
    seoConfig.productKeywords,
    seoConfig.painPointKeywords
  ],
  '/',
  undefined,
  'en'
);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
