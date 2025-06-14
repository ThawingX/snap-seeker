import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { Metadata, Viewport } from "next";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <VercelAnalytics />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <GoogleTagManagerNoScript />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
