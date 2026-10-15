import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

const intro = "At Aqiran Xchange (formerly Dr iTunes Consult), transparency is the foundation of our partnership with you.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: intro,
};

const sections: LegalSection[] = [
  {
    "title": "Information We Collect",
    "content": "We collect information to provide better services to all our users. This includes your name, email address, phone number, and KYC (Know Your Customer) documents such as government-issued IDs and selfies for identity verification. We also collect device-specific information like your device model and FCM tokens for notifications."
  },
  {
    "title": "How We Use Information",
    "content": "We use the information we collect to process your trades, verify your identity for security, and communicate with you about your account. Your email is used for transactional updates and our newsletter (subject to your confirmation). We use Postmark for reliable email delivery."
  },
  {
    "title": "Trade Security & KYC",
    "content": "Security is our top priority. Your KYC documents are used strictly for verification purposes to prevent fraud and comply with financial regulations. We use industry-standard encryption and Laravel Sanctum for secure API authentication."
  },
  {
    "title": "Information Sharing",
    "content": "We do not share your personal information with companies, organizations, or individuals outside of Aqiran Xchange except in very limited circumstances, such as for legal reasons or with your explicit consent."
  },
  {
    "title": "Your Data Rights",
    "content": "You have the right to access, update, or delete your account at any time. You can manage your notification settings and unsubscribe from our newsletter using the links provided in our emails."
  }
];

export default function Page() {
  return <LegalPage title="Privacy Policy" intro={intro} updated="March 18, 2026" sections={sections} />;
}
