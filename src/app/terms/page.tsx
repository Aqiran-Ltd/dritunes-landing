import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

const intro = "Rules of engagement for a smooth and secure trading experience.";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: intro,
};

const sections: LegalSection[] = [
  {
    "title": "The Trade of Trust",
    "content": "By using Aqiran Xchange (formerly Dr iTunes Consult), you enter into a partnership built on mutual trust. You agree to provide accurate information and use our services only for lawful purposes. We reserve the right to refuse service to anyone who violates these terms or attempts fraudulent activity."
  },
  {
    "title": "The Trading Workflow",
    "content": "When you initiate a trade, you will receive a live quote based on current market rates. Quotes are valid for a limited time (typically 15-30 minutes). Once you confirm the trade and provide the asset (Gift Card), our team verifies the asset before processing the payout."
  },
  {
    "title": "Identity & KYC",
    "content": "To ensure a secure environment, we require KYC verification for all active traders. This involves submitting a government-issued ID and a selfie. We keep this data secure and use it solely to protect both you and our platform from unauthorized access."
  },
  {
    "title": "Instant Payouts",
    "content": "Once a trade is verified, we process payouts instantly to your saved Mobile Money or Bank account. While we aim for 'instant' delivery, occasional delays may occur due to network maintenance or banking system downtimes beyond our control."
  },
  {
    "title": "Prohibited Activities",
    "content": "Attempting to trade stolen cards, using third-party accounts for payouts, or providing false identification is strictly prohibited. Such actions will result in immediate account suspension and may be reported to the relevant authorities."
  }
];

export default function Page() {
  return <LegalPage title="Terms of Service" intro={intro} updated="March 18, 2026" sections={sections} />;
}
