import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Toaster } from "react-hot-toast";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#F5B400",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dritunesconsult.com"),
  title: {
    default: "Dr iTunes Consult - Ghana's Premier Gift Card Trading Service",
    template: "%s | Dr iTunes Consult"
  },
  description: "Ghana's most trusted gift card trading service. Trade online via WhatsApp/Telegram or visit our physical store in Tamale. Best rates, 24/7 support, secure transactions for Gift Cards.",
  keywords: [
    "gift card exchange Ghana", 
    "Tamale gift card store", 
    "sell gift cards Ghana", 
    "Amazon gift cards Ghana", 
    "iTunes gift cards Ghana", 
    "Steam wallet Ghana", 
    "best rates gift cards",
    "secure gift card trading"
  ],
  authors: [{ name: "Dr iTunes Consult" }],
  creator: "Dr iTunes Consult",
  publisher: "Dr iTunes Consult",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "Dr iTunes Consult - Ghana's Premier Gift Card Trading Service",
    description: "Ghana's most trusted gift card trading service. Trade online or visit our Tamale store for the best rates on Gift Cards.",
    url: "https://dritunesconsult.com",
    siteName: "Dr iTunes Consult",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/logo/red-black.png',
        width: 1200,
        height: 630,
        alt: 'Dr iTunes Consult Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr iTunes Consult - Ghana's Premier Gift Card Trading Service",
    description: "Trade Gift Cards securely in Ghana. Best rates, 24/7 support, and physical store in Tamale.",
    images: ['/logo/red-black.png'],
    creator: "@dritunes",
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dr iTunes Consult",
    "url": "https://dritunesconsult.com",
    "logo": "https://dritunesconsult.com/logo/red-black.png",
    "sameAs": [
      "https://facebook.com/profile.php?id=61577944273619",
      "https://instagram.com/dr.itunesconsult/",
      "https://t.me/dritunes",
      "https://x.com/dritunes",
      "https://youtube.com/@dritunes"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+233-548-434-599",
      "contactType": "customer service",
      "areaServed": "GH",
      "availableLanguage": "English"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Dr iTunes Consult",
    "image": "https://dritunesconsult.com/logo/red-black.png",
    "@id": "https://dritunesconsult.com",
    "url": "https://dritunesconsult.com",
    "telephone": "+233548434599",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Street",
      "addressLocality": "Tamale",
      "addressRegion": "Northern Region",
      "postalCode": "00233",
      "addressCountry": "GH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.4007,
      "longitude": -0.8393
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <MaintenanceGuard>
                <NotificationProvider>
                  {children}
                  <Analytics />
                  <Toaster position="top-right" />
                </NotificationProvider>
              </MaintenanceGuard>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
