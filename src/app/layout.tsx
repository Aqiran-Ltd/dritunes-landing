import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dr iTunes Consult - Ghana's Premier Crypto & Gift Card Trading Service",
  description: "Ghana's most trusted crypto and gift card trading service. Trade online via WhatsApp/Telegram or visit our physical store in Tamale. Best rates, 24/7 support, secure transactions.",
  keywords: "crypto trading, gift card exchange, Ghana, Tamale, Bitcoin, Ethereum, USDT, Amazon gift cards, Apple gift cards, digital finance",
  authors: [{ name: "Dr iTunes Consult" }],
  creator: "Dr iTunes Consult",
  icons: {
    icon: [
      { url: '/logo/red-black.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/red-black.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo/red-black.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo/red-black.png',
  },
  openGraph: {
    title: "Dr iTunes Consult - Ghana's Premier Crypto & Gift Card Trading Service",
    description: "Ghana's most trusted crypto and gift card trading service. Trade online via WhatsApp/Telegram or visit our physical store in Tamale.",
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
    title: "Dr iTunes Consult - Ghana's Premier Crypto & Gift Card Trading Service",
    description: "Ghana's most trusted crypto and gift card trading service. Trade online via WhatsApp/Telegram or visit our physical store in Tamale.",
    images: ['/logo/red-black.png'],
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
        className={`${urbanist.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
