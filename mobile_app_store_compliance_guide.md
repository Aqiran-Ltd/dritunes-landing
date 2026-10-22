# Aqiran Xchange — Mobile App Store Compliance & Legal Guide

> **Scope:** Google Play Store & Apple App Store submission, Play Console Data Safety declarations, App Store Connect Privacy Nutrition Labels, App Descriptions, and In-App Legal Integrations (Flutter / Mobile).

---

## 1. Executive Summary & Policy Compliance Context

Aqiran Xchange operates as an **independent secondary marketplace** facilitating the exchange of unredeemed, secondary digital gift cards for instant Ghanaian Cedi (GHS) cashouts via Mobile Money and local banks. 

To satisfy Apple and Google store review requirements without triggering rejection for trademark infringement or misleading data declarations:
1. **Independent Secondary Marketplace & Brand Disclaimers:** Explicitly clarify in the App Description, Terms of Service, Privacy Policy, and in-app legal dialogs that Aqiran Xchange is an independent secondary exchange and is **not affiliated with, endorsed by, sponsored by, or authorized by** the brand owners whose gift cards are traded (e.g., Apple, Amazon, Steam, Google, Razer, Sony).
2. **Data Safety / Privacy Nutrition Labels:** Explicitly declare the collection of **Financial Information** (bank account details and mobile money phone numbers for cash payouts) and **Identity Information** (basic profile: name, email, phone number, username).
3. **Explicit Zero-KYC Policy:** Clarify that the platform **does not collect KYC documents** (no passports, driver's licenses, national ID cards, BVN, NIN, SSN, or facial biometric/selfie scans).

---

## 2. Store Listing Copy (Google Play & Apple App Store)

### A. App Name & Titles (30-Character Limit)
* **Google Play App Title:** `Aqiran Xchange: Trade & Payout` *(29 chars)*
* **Apple App Store Name:** `Aqiran Xchange` *(14 chars)*
* **Apple App Store Subtitle:** `Fast Gift Card Cashouts` *(24 chars)*

### B. Short Description (Google Play — 80-Character Limit)
```text
Trade gift cards for instant cedis. Fast, secure secondary market payouts.
```

### C. Full Description (Google Play & Apple App Store)
```text
Welcome to Aqiran Xchange (formerly Dr iTunes Consult) — Northern Ghana's premier secondary digital asset and gift card exchange platform.

Get the best rates and instant Ghanaian Cedi (GHS) payouts directly to your Mobile Money (MTN MoMo, Telecel Cash, AT Money) or local bank account. Whether you trade online in the app, chat directly with our 24/7 support desk on WhatsApp and Telegram, or visit our physical counter in Tamale, Aqiran Xchange makes gift card trading frictionless, fast, and secure.

WHY TRADE WITH AQIRAN XCHANGE?
• Instant Cedis Payouts: Zero waiting. Receive instant cash settlements the moment your trade is authenticated.
• Transparent, Live Market Rates: Check live quotes before you trade with our real-time exchange calculator.
• Streamlined, No-KYC Trading: Fast onboarding with zero KYC hassle. No uploading passports, national IDs, or facial biometric scans.
• Multiple Payment Rails: Instant cashout to all Ghanaian Mobile Money networks and bank accounts.
• 24/7 Human Support: Speak with our responsive support desk via WhatsApp, Telegram, or in-app live chat.
• Trusted Legacy: Over 10,000+ traders served and ₵50M+ disbursed across Ghana.

HOW IT WORKS:
1. Select your gift card brand (Apple, Amazon, Steam, Google Play, Razer, Xbox, etc.) and denomination.
2. Get a live, transparent quote.
3. Submit the card claim code or physical card pack photo.
4. Enter your Mobile Money or Bank details for instant cashout.
5. Receive funds in your account within minutes!

============================================================
IMPORTANT DISCLAIMERS & LEGAL DISCLOSURES:
============================================================
• INDEPENDENT SECONDARY MARKETPLACE: Aqiran Xchange operates strictly as an independent secondary marketplace facilitating customer-to-business and peer liquidity for pre-owned, stored-value digital assets.
• BRAND NON-AFFILIATION: Aqiran Xchange is NOT affiliated with, sponsored by, endorsed by, authorized by, or in any way officially associated with Apple Inc., Amazon.com, Inc., Valve Corporation (Steam), Google LLC, Razer Inc., Sony Interactive Entertainment, Microsoft Corporation, or any other trademark owner whose products or gift cards are referenced.
• TRADEMARK NOTICE: All trademarks, service marks, brand names, product titles, emblems, and logos referenced within this app are the registered intellectual property of their respective owners. Their mention is strictly for descriptive, nominative fair use to identify the secondary gift cards being exchanged by consumers.
• PRIVACY & ZERO KYC: We do not collect government-issued ID documents or biometric selfies. We collect basic account credentials and financial payout details (MoMo / bank info) strictly to execute your trade disbursements.

Need assistance? Visit our counter in Tamale or email info@aqiranxchange.com.
```

---

## 3. Google Play Console Data Safety Questionnaire Answers

When completing the **Data Safety form** in Google Play Console:

| Question / Section | Play Console Answer | Rationale / Purpose |
| :--- | :--- | :--- |
| **Does your app collect or share user data?** | **Yes** | App collects basic profile, financial payout info, and trade data. |
| **Is all user data encrypted in transit?** | **Yes** | All API traffic is TLS 1.3 / HTTPS. |
| **Do you provide a way for users to request data deletion?** | **Yes** | In-app delete button and URL: `https://aqiranxchange.com/auth/delete-account`. |
| **Financial Info: Bank account / Payment details** | **Collected: Yes**<br>**Shared: Yes**<br>Ephemeral: No<br>Optional: Yes | Collected to disburse cashouts. Shared strictly with regulated payment processors/banks. |
| **Personal Info: Name, Email, Phone number** | **Collected: Yes**<br>**Shared: No**<br>Ephemeral: No<br>Optional: No | Account creation, receipts, and login authentication. |
| **Personal Info: Government ID (KYC)** | **Collected: NO** | **Aqiran Xchange does NOT conduct KYC or collect national IDs.** |
| **Photos and Videos (Card pack photos/receipts)** | **Collected: Yes**<br>**Shared: No**<br>Ephemeral: No<br>Optional: Yes | User content uploaded strictly to verify gift card legitimacy. |
| **Device or other IDs (FCM push token)** | **Collected: Yes**<br>**Shared: No**<br>Ephemeral: No<br>Optional: No | Delivering push alerts when trades are credited. |

---

## 4. Apple App Store Connect Privacy Nutrition Labels

When completing the **App Privacy** section in App Store Connect:

### 1. Data Used to Track You
* **Answer:** **None**. (Aqiran Xchange does not track users across other companies' apps or websites for targeted advertising).

### 2. Data Linked to You (Associated with User Account)
* **Financial Info:**
  * **Payment Info:** Yes (Bank account numbers, Mobile Money phone numbers).
  * *Purpose:* App Functionality (Payout disbursements).
* **Contact Info:**
  * **Email Address, Name, Phone Number:** Yes.
  * *Purpose:* App Functionality, Account Management, Communications.
* **User Content:**
  * **Customer Support / Photos:** Yes (Uploaded card photos & claim codes).
  * *Purpose:* App Functionality (Trade verification).
* **Identifiers:**
  * **User ID:** Yes (Account ID / Sanctum token).
  * *Purpose:* App Functionality.

### 3. Data Not Linked to You
* **Diagnostics:**
  * **Crash Data & Performance Data:** Yes (Sentry error logs).
  * *Purpose:* Analytics and App Health (Pseudonymous).

---

## 5. In-App Mobile Integration (Flutter / Mobile Architecture)

The mobile app mirrors the web application. In your Flutter codebase, implement:

### A. Legal Links in Settings Menu
Provide direct access to the live responsive legal endpoints:
```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class LegalSettingsWidget extends StatelessWidget {
  const LegalSettingsWidget({Key? key}) : super(key: key);

  void _openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.inAppWebView);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: const Icon(Icons.shield_outlined),
          title: const Text('Privacy Policy & Data Safety'),
          subtitle: const Text('Financial & identity disclosures (No KYC)'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => _openUrl('https://aqiranxchange.com/privacy'),
        ),
        ListTile(
          leading: const Icon(Icons.gavel_outlined),
          title: const Text('Terms of Service'),
          subtitle: const Text('Secondary marketplace disclaimers'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => _openUrl('https://aqiranxchange.com/terms'),
        ),
      ],
    );
  }
}
```

### B. In-App Secondary Marketplace Banner / Disclaimer
Place this reusable banner at the bottom of the Trade Creation screen or within the About dialog:
```dart
Widget buildSecondaryMarketplaceNotice() {
  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: Colors.amber.withOpacity(0.08),
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: Colors.amber.withOpacity(0.3)),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.info_outline, size: 18, color: Color(0xFFF5B400)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            'Aqiran Xchange is an independent secondary marketplace. We are not affiliated with, endorsed by, or sponsored by Apple, Amazon, Steam, Google, or any brand whose cards are traded. All trademarks belong to their respective owners.',
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey[700],
              height: 1.4,
            ),
          ),
        ),
      ],
    ),
  );
}
```

---

## 6. Official Legal Endpoints Summary

| Document | Canonical Web & Mobile URL |
| :--- | :--- |
| **Privacy Policy & Data Nutrition Labels** | `https://aqiranxchange.com/privacy` |
| **Terms of Service & Secondary Disclaimers** | `https://aqiranxchange.com/terms` |
| **Cookie Policy** | `https://aqiranxchange.com/cookies` |
| **Account Deletion Portal** | `https://aqiranxchange.com/auth/delete-account` |
| **Support & Compliance Contact** | `https://aqiranxchange.com/contact` • `info@aqiranxchange.com` |
