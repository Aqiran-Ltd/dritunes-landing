import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import Link from "next/link";
import { 
  ShieldCheckIcon, 
  CreditCardIcon, 
  UserIcon, 
  DevicePhoneMobileIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const intro = "At Aqiran Xchange (formerly Dr iTunes Consult), we believe in transparent, straightforward digital trading. This Privacy Policy details how we collect, use, and protect your information across our web platform (aqiranxchange.com) and our official mobile applications (iOS and Android).";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Safety Nutrition Labels",
  description: "Aqiran Xchange Privacy Policy and Data Safety Nutrition Labels. Clear disclosures on financial data for payouts, account identity info, zero KYC collection, and secondary marketplace operations across web and mobile apps.",
};

const sections: LegalSection[] = [
  {
    title: "Platform Scope: Web & Mobile Applications",
    badge: "Cross-Platform",
    content: (
      <div className="space-y-4">
        <p>
          This Privacy Policy governs the collection, processing, and storage of personal information across all digital touchpoints provided by <strong>Aqiran Xchange</strong> (referred to herein as &ldquo;Aqiran Xchange&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), formerly known as <strong>Dr iTunes Consult</strong>.
        </p>
        <p>
          Whether you access our services through our website (<strong>aqiranxchange.com</strong>), our progressive web app, or our official mobile applications distributed on the <strong>Apple App Store</strong> and <strong>Google Play Store</strong>, this policy applies uniformly. Our mobile applications operate with identical business logic, settlement workflows, and privacy protections as our web platform.
        </p>
      </div>
    ),
  },
  {
    title: "Explicit 'Zero KYC' Policy & Philosophy",
    badge: "No KYC Required",
    content: (
      <div className="space-y-4">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 text-amber-950 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-gold-600 dark:text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-ink dark:text-white">We Do Not Collect KYC Documents</h4>
              <p className="mt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Aqiran Xchange does <strong>NOT</strong> require or process Know Your Customer (KYC) identity documentation. We do not ask for, collect, scan, or store government-issued IDs, international passports, national identification cards (such as Ghana Card, NIN, BVN, or SSN), driver&rsquo;s licenses, facial biometrics, or selfie videos.
              </p>
            </div>
          </div>
        </div>
        <p>
          Our trade verification model focuses strictly on authenticating the digital assets (gift cards) submitted for exchange and verifying the recipient payout destination (your Mobile Money wallet or bank account). This minimizes data collection and respects customer privacy without creating unnecessary security vulnerabilities associated with centralized identity document repositories.
        </p>
      </div>
    ),
  },
  {
    title: "Data Safety & Privacy Nutrition Labels",
    badge: "App Store & Play Store Declarations",
    content: (
      <div className="space-y-6">
        <p>
          In accordance with standard mobile app store transparency guidelines (including <strong>Apple Privacy Nutrition Labels</strong> and <strong>Google Play Data Safety</strong> disclosures), we explicitly categorize the exact data types collected, the legitimate business purposes for collection, and our strict handling rules:
        </p>

        {/* Nutrition Label Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Financial Info Card */}
          <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 dark:bg-gold-500/10 p-5 space-y-3">
            <div className="flex items-center gap-2 text-gold-700 dark:text-gold">
              <CreditCardIcon className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink dark:text-white">1. Financial Information</h3>
            </div>
            <div className="text-xs sm:text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Data Types Collected:</strong> Bank details (bank name, account number, account holder name) and Mobile Money credentials (e.g., MTN MoMo, Telecel Cash, AT Money phone numbers and registered subscriber names), as well as cash payout transaction logs.
              </p>
              <p>
                <strong>Purpose of Collection:</strong> Strictly collected for <strong>App Functionality &amp; Cash Payouts</strong>. When your trade is accepted, we require valid payout details to disburse instant cedis to your designated wallet or bank account.
              </p>
              <p>
                <strong>Third-Party Sharing:</strong> Shared solely with licensed, regulated payment processors and settlement banks strictly to execute payout transfers. We <em>never</em> sell, rent, or trade your financial info.
              </p>
            </div>
          </div>

          {/* Identity Info Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <UserIcon className="w-5 h-5 text-gold-600 dark:text-gold" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink dark:text-white">2. Identity Information</h3>
            </div>
            <div className="text-xs sm:text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Data Types Collected:</strong> Basic account identity details provided directly by you: full name, email address, phone number (WhatsApp/SMS), and username/handle.
              </p>
              <p>
                <strong>Purpose of Collection:</strong> Used for <strong>Account Management &amp; Communication</strong> — enabling sign-in, maintaining your trade history ledger, delivering trade completion receipts, providing customer support, and sending critical security notices.
              </p>
              <p>
                <strong>Distinction:</strong> Basic profile credentials only. As stated above, this does <em>not</em> include government identity documents or biometric scans.
              </p>
            </div>
          </div>

          {/* User Content / Trade Data Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ShieldCheckIcon className="w-5 h-5 text-gold-600 dark:text-gold" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink dark:text-white">3. Gift Card &amp; Trade Content</h3>
            </div>
            <div className="text-xs sm:text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Data Types Collected:</strong> Gift card brand (e.g., Apple, Amazon, Steam), face value currency and denomination, e-codes, card claim codes, and uploaded receipt/card photographs.
              </p>
              <p>
                <strong>Purpose of Collection:</strong> Necessary to inspect, authenticate, redeem, and calculate real-time trade quotes for the requested exchange.
              </p>
            </div>
          </div>

          {/* Device & Diagnostic Data Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <DevicePhoneMobileIcon className="w-5 h-5 text-gold-600 dark:text-gold" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-ink dark:text-white">4. Device &amp; Technical Diagnostics</h3>
            </div>
            <div className="text-xs sm:text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Data Types Collected:</strong> Device model, OS version, IP address, Firebase Cloud Messaging (FCM) push tokens, and crash reporting logs (via Sentry).
              </p>
              <p>
                <strong>Purpose of Collection:</strong> Push notification delivery (e.g., &ldquo;Your trade has been paid out!&rdquo;), session security, bot protection, and debugging system crashes.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nutrition Reference Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink dark:text-white">
              Data Safety Nutrition Summary Matrix
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="p-3">Data Category</th>
                  <th className="p-3">Collected?</th>
                  <th className="p-3">Linked to Identity?</th>
                  <th className="p-3">Cross-App Tracking?</th>
                  <th className="p-3">Primary Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-3 font-semibold text-ink dark:text-white">Financial Information (Bank &amp; MoMo)</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Yes
                  </td>
                  <td className="p-3">Yes (Account Profile)</td>
                  <td className="p-3 text-gray-500">No (Never)</td>
                  <td className="p-3">Instant cash payouts &amp; fraud mitigation</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink dark:text-white">Identity Information (Name, Email, Phone)</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Yes
                  </td>
                  <td className="p-3">Yes (Account Profile)</td>
                  <td className="p-3 text-gray-500">No (Never)</td>
                  <td className="p-3">Account setup &amp; trade notifications</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink dark:text-white">Government ID &amp; KYC Biometrics</td>
                  <td className="p-3 text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                    <XCircleIcon className="w-4 h-4" /> No (Zero KYC)
                  </td>
                  <td className="p-3 text-gray-500">N/A</td>
                  <td className="p-3 text-gray-500">N/A</td>
                  <td className="p-3 text-gray-500">Not collected or stored</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink dark:text-white">Trade Data (Cards &amp; Receipts)</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Yes
                  </td>
                  <td className="p-3">Yes (Trade History)</td>
                  <td className="p-3 text-gray-500">No (Never)</td>
                  <td className="p-3">Secondary card valuation &amp; settlement</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink dark:text-white">Technical Diagnostics &amp; Push Tokens</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Yes
                  </td>
                  <td className="p-3">No (Pseudonymous)</td>
                  <td className="p-3 text-gray-500">No (Never)</td>
                  <td className="p-3">FCM alerts &amp; system health</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Independent Secondary Marketplace Role & Disclaimers",
    badge: "Legal Disclaimer",
    content: (
      <div className="space-y-4">
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="w-6 h-6 text-gold-600 dark:text-gold shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-ink dark:text-white">
                Independent Secondary Marketplace Disclaimer
              </p>
              <p>
                <strong>Aqiran Xchange is an independent secondary marketplace</strong> facilitating peer asset sales and trades. Aqiran Xchange is <strong>not affiliated with, endorsed by, authorized by, sponsored by, or in any way officially associated with</strong> any brand, merchant, or trademark owner whose gift cards or digital products are bought, sold, or referenced on this platform (including but not limited to <strong>Apple Inc., Amazon.com, Inc., Valve Corporation (Steam), Google LLC, Razer Inc., Sony Interactive Entertainment, Microsoft Corporation</strong>, or any of their affiliates or subsidiaries).
              </p>
              <p>
                All trademarks, brand names, product emblems, service marks, and logos displayed on our website and mobile apps are the registered property of their respective trademark owners. Any mention of these trademarks on Aqiran Xchange is purely for descriptive, nominative fair use to identify the specific secondary gift card items being transacted by consumers.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "How We Protect and Retain Your Data",
    badge: "Security & Encryption",
    content: (
      <div className="space-y-4">
        <p>
          We employ robust, industry-standard cybersecurity measures to protect your financial details and identity information:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Encryption in Transit:</strong> All communication between your browser or mobile application and our servers is secured using modern TLS 1.3 / HTTPS encryption.</li>
          <li><strong>API Security:</strong> Backend transactions utilize Laravel Sanctum tokenized authentication. Sensitive payout records are guarded behind strict role-based access controls and encrypted database storage.</li>
          <li><strong>Data Minimization:</strong> By eliminating KYC identity document collection, we reduce your exposure to identity theft or credential exposure.</li>
          <li><strong>Retention Period:</strong> Profile and financial payout methods are retained only as long as your account remains active. Transaction receipts are maintained for accounting reconciliation in accordance with applicable financial record-keeping standards.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Your Data Rights & Permanent Account Deletion",
    badge: "User Autonomy",
    content: (
      <div className="space-y-4">
        <p>
          You maintain full ownership of your data. Under Ghana Data Protection Act 2012 (Act 843) and international data privacy frameworks, you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Access &amp; Export:</strong> Review your stored profile details, active payout methods, and transaction history at any time through your dashboard.</li>
          <li><strong>Modify Payout Methods:</strong> Add, edit, or delete connected Mobile Money numbers or bank account numbers at will via Payment Settings.</li>
          <li><strong>Permanent Deletion:</strong> You may permanently delete your account at any time directly through the mobile app or via our <Link href="/auth/delete-account" className="font-semibold text-ink dark:text-white underline underline-offset-4">Account Deletion Portal</Link>. Deleting your account immediately wipes your profile identity, active login sessions, and saved payout credentials from our active database.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Contact Our Privacy & Compliance Team",
    content: (
      <div className="space-y-4">
        <p>
          If you have questions about this Privacy Policy, our Data Safety declarations, or wish to submit a data request, please contact us:
        </p>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-4 text-sm space-y-1">
          <p><strong>Aqiran Xchange (Aqiran Ltd.)</strong></p>
          <p>Email: <a href="mailto:info@aqiranxchange.com" className="text-gold-600 dark:text-gold hover:underline">info@aqiranxchange.com</a></p>
          <p>Physical Counter: Tamale, Northern Region, Ghana</p>
          <p>WhatsApp Support: <a href="https://wa.me/233548434599" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold hover:underline">+233 54 843 4599</a></p>
        </div>
      </div>
    ),
  }
];

export default function Page() {
  return (
    <LegalPage 
      title="Privacy Policy" 
      badge="Data Safety & Nutrition Labels"
      intro={intro} 
      updated="October 22, 2026" 
      sections={sections} 
    />
  );
}
