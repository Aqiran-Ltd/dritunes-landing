import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import Link from "next/link";
import { 
  BuildingStorefrontIcon, 
  ShieldCheckIcon, 
  BanknotesIcon, 
  ExclamationTriangleIcon, 
  ScaleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const intro = "These Terms of Service govern your access to and use of Aqiran Xchange (formerly Dr iTunes Consult) across our website (aqiranxchange.com) and our official mobile applications (iOS and Android). By creating an account or initiating a trade, you agree to these terms.";

export const metadata: Metadata = {
  title: "Terms of Service & Secondary Marketplace Disclaimers",
  description: "Terms of Service for Aqiran Xchange. Transparent terms governing gift card trading, instant cash payouts, our independent secondary marketplace disclaimer, and zero-KYC user onboarding across web and mobile apps.",
};

const sections: LegalSection[] = [
  {
    title: "The Trade of Trust & Cross-Platform Scope",
    badge: "Agreement",
    content: (
      <div className="space-y-4">
        <p>
          Welcome to <strong>Aqiran Xchange</strong> (formerly operating as <em>Dr iTunes Consult</em>), operated by Aqiran Ltd. These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Trader&rdquo;, or &ldquo;you&rdquo;) and Aqiran Xchange (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
        </p>
        <p>
          These Terms apply uniformly across all platforms and client interfaces through which our exchange is delivered, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The web application hosted at <strong>aqiranxchange.com</strong> and its subdomains.</li>
          <li>Our official mobile applications distributed on the <strong>Apple App Store (iOS)</strong> and <strong>Google Play Store (Android)</strong>.</li>
          <li>Our dedicated over-the-counter physical desk in Tamale, Ghana, and authorized chat-trading desks (WhatsApp &amp; Telegram).</li>
        </ul>
        <p>
          By downloading our mobile app, registering an account, or submitting any digital gift card asset for trading, you certify that you are of legal age and possess the legal authority to enter into these Terms.
        </p>
      </div>
    ),
  },
  {
    title: "Independent Secondary Marketplace & Brand Disclaimers",
    badge: "Crucial Legal Notice",
    content: (
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-gold-500/40 bg-gold-500/5 dark:bg-gold-500/10 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-gold-700 dark:text-gold font-bold text-sm uppercase tracking-wider">
            <BuildingStorefrontIcon className="w-5 h-5 shrink-0" />
            <span>Independent Secondary Marketplace Declaration</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed space-y-3">
            <p>
              <strong>1. Secondary Marketplace Facilitator:</strong> Aqiran Xchange operates strictly as an <strong>independent secondary market exchange</strong> facilitating customer-to-business and peer liquidity for unredeemed, pre-owned closed-loop digital gift cards and prepaid balances.
            </p>
            <p>
              <strong>2. No Endorsement or Affiliation:</strong> Aqiran Xchange is <strong>NOT affiliated with, endorsed by, sponsored by, authorized by, or in any way officially associated with</strong> the issuers, merchants, or corporate owners of the gift cards traded on the platform. This includes, without limitation:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-medium text-ink dark:text-white pt-1">
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Apple Inc. (iTunes)</span>
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Amazon.com, Inc.</span>
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Valve Corp. (Steam)</span>
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Google LLC (Play)</span>
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Razer Inc. (Gold)</span>
              <span className="p-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">• Sony / PlayStation</span>
            </div>
            <p>
              <strong>3. Trademark Ownership &amp; Nominative Fair Use:</strong> All brand names, trademarks, product names, logos, and registered marks displayed on our website, mobile app, and marketing materials are the exclusive property of their respective trademark owners. Any reference to these trademarks is purely nominative and descriptive, intended solely to identify the brand, denomination, and system compatibility of the secondary gift cards being exchanged.
            </p>
            <p>
              <strong>4. Non-Issuer Status:</strong> Aqiran Xchange is not a gift card issuer. We do not manufacture, reprint, or issue gift cards. All cards exchanged are secondary stored-value products purchased from legitimate retail sources by the customer.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Zero KYC Onboarding & User Warranties",
    badge: "Frictionless Access",
    content: (
      <div className="space-y-4">
        <p>
          Aqiran Xchange believes in maximum efficiency and user data privacy:
        </p>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>No KYC Identification Required</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            You do <strong>not</strong> need to upload passports, driver&rsquo;s licenses, national identity cards, or facial selfie scans to trade on Aqiran Xchange. We do not operate a centralized database of customer identity papers.
          </p>
        </div>
        <p>
          In exchange for this streamlined, private experience, you agree and warrant that:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
          <li><strong>Lawful Ownership:</strong> Any gift card code or image submitted is 100% lawfully acquired, fully owned by you, and unredeemed. You possess the unencumbered legal right to transfer and sell the asset.</li>
          <li><strong>Accurate Profile Info:</strong> You will provide true and accurate basic identity details (name, email address, phone number) for account communications and trade receipt delivery.</li>
          <li><strong>Accurate Payout Details:</strong> You are the authorized owner of the designated Mobile Money number (MTN MoMo, Telecel Cash, AT Money) or bank account submitted for payout disbursement.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Trading Workflow, Live Quotes & Valuation",
    badge: "Trade Lifecycle",
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <ClockIcon className="w-6 h-6 text-gold-600 dark:text-gold shrink-0 mt-1" />
          <div className="space-y-3">
            <p>
              <strong>1. Real-Time Quotes:</strong> Rates published on our website and mobile app reflect dynamic secondary market liquidity. When initiating a trade, you are presented with a live quotation based on the brand, country currency, card type (e-code vs physical card with receipt), and face value.
            </p>
            <p>
              <strong>2. Quote Validity Window:</strong> Generated trade quotes are valid for a specified window (typically 15 to 30 minutes). You must upload the asset code/images within this window to lock in the stated exchange rate. If a trade is submitted after the validity expires, it will be recalculated at the prevailing rate upon receipt.
            </p>
            <p>
              <strong>3. Asset Inspection &amp; Verification:</strong> Before payouts are disbursed, every submitted card code or receipt is authenticated through our verification pipeline to ensure validity, correct balance, and active redemption status.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Financial Information & Instant Payout Settlements",
    badge: "Cedis Cashout",
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <BanknotesIcon className="w-6 h-6 text-gold-600 dark:text-gold shrink-0 mt-1" />
          <div className="space-y-3 text-sm sm:text-base">
            <p>
              <strong>Collection of Financial Payout Data:</strong> To deliver cash proceeds from your secondary trade, you must provide your financial settlement credentials — specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Mobile Money:</strong> Service provider (MTN MoMo, Telecel Cash, AT Money), account phone number, and registered subscriber name.</li>
              <li><strong>Bank Transfer:</strong> Bank name, account number, branch/routing code, and account holder name.</li>
            </ul>
            <p>
              <strong>Payout Execution &amp; Finality:</strong> Once your card verification is completed, our automated systems dispatch the Ghanaian Cedi (GHS) payout immediately to your chosen settlement channel.
            </p>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
              <strong>User Responsibility for Account Details:</strong> Payouts are executed strictly to the exact mobile money number or bank account specified in your trade submission. Aqiran Xchange cannot reverse settlements sent to an incorrect number entered by the user. Please double-check your payout numbers before confirming.
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Occasional delays may occur as a result of telecom network downtimes or inter-bank clearing maintenance. Our 24/7 support desk is available to trace any delayed settlement.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Strictly Prohibited Activities & Anti-Fraud Policy",
    badge: "Zero Tolerance",
    content: (
      <div className="space-y-4">
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
            <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
            <span>Fraud Prevention &amp; Immediate Remedies</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            Aqiran Xchange maintains zero tolerance for fraudulent conduct. The following actions constitute immediate, material breach of these Terms:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li>Submitting stolen gift cards, counterfeit cards, or assets acquired through scamming, phishing, or unauthorized card charges.</li>
            <li>Double-spending or attempting to redeem cards after submitting them to our platform for exchange.</li>
            <li>Submitting fabricated, photoshopped, or altered purchase receipts or card pack photos.</li>
            <li>Using automated bots, scrapers, or reverse-engineering tools against our mobile app or web endpoints.</li>
            <li>Attempting unauthorized chargebacks or dispute filings against completed payouts.</li>
          </ul>
          <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium pt-1">
            Violation will result in immediate trade cancellation, account suspension, forfeiture of fraudulent funds, and reporting to law enforcement authorities where warranted.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Disclaimers, Limitation of Liability & Governing Law",
    badge: "Legal Protections",
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <ScaleIcon className="w-6 h-6 text-gold-600 dark:text-gold shrink-0 mt-1" />
          <div className="space-y-3 text-sm sm:text-base">
            <p>
              <strong>&ldquo;As-Is&rdquo; Service:</strong> Aqiran Xchange web and mobile applications are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied, including fitness for a particular purpose or merchantability.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> To the maximum extent permitted by applicable law, Aqiran Xchange, its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits arising out of your use of or inability to use our services. In no event shall our aggregate liability exceed the total face value of the specific trade in dispute.
            </p>
            <p>
              <strong>Governing Law &amp; Dispute Resolution:</strong> These Terms shall be governed by, construed, and enforced in accordance with the laws of the Republic of Ghana. Any disputes that cannot be resolved amicably through direct consultation with our support desk shall be submitted to the exclusive jurisdiction of the competent courts of Ghana.
            </p>
            <p>
              <strong>Account Deletion:</strong> You may terminate these Terms at any time by ceasing use of our services and deleting your account via the mobile app or through our <Link href="/auth/delete-account" className="font-semibold text-ink dark:text-white underline underline-offset-4">Delete Account Portal</Link>.
            </p>
          </div>
        </div>
      </div>
    ),
  }
];

export default function Page() {
  return (
    <LegalPage 
      title="Terms of Service" 
      badge="Secondary Marketplace Terms"
      intro={intro} 
      updated="October 22, 2026" 
      sections={sections} 
    />
  );
}
