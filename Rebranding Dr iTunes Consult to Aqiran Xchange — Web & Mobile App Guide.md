# Rebranding Dr iTunes Consult to Aqiran Xchange — Web & Mobile App Guide

Oct 15, 2026 · @Aby

## Overview

Change everything customers see — name, logo, colours, domain, emails, store listings — and change nothing customers depend on: accounts, balances, trade history, payment flows and app identifiers stay exactly as they are. The old domain keeps working and redirects for at least 12 months.

Work in this order. Each phase can ship on its own, but the domain and redirects must be live before you announce anything.

1. **Prep** — brand assets, a full inventory of every place the old name appears, and a rebrand branch.
2. **Domain, email and redirects** — aqiranxchange.com live, dritunesconsult.com redirecting, new email sending.
3. **Web app** — app name, theme, logos, favicons, emails, legal pages, SEO.
4. **Mobile app** — display name, icon, splash, theme, store listings.
5. **Launch** — announce with the rebrand flyers, in-app notice, social and email.
6. **After launch** — watch for broken links, errors and confused customers; clean up later.

The brand values to use everywhere:

| Token | Value | Use |
| --- | --- | --- |
| Primary — Trade Gold | `#F5B400` | Buttons, highlights, app icon background |
| Ink — Charcoal | `#141416` | Text, dark surfaces, text on gold buttons |
| Accent — Aqiran Crimson | `#ED1848` | Parent-brand accent, alerts, stickers |
| Surface | `#FFFFFF` | Light backgrounds |
| Typeface | Sora (Google Fonts) | Headings and UI |

Gold on white is low contrast, so never use it for body text. Put charcoal text on gold buttons, not white.

## Phase 0 — Prep

Get the assets into the repos and find every trace of the old name before changing anything.

- [ ] Download `aqiran-logos-svg.zip` from the design chat and add the Xchange files to each repo: `aqiran-xchange-logo.svg`, `aqiran-xchange-logo-white.svg`, `aqiran-xchange-icon.svg` (1024×1024 app icon), `aqiran-xchange-monogram.svg`.
- [ ] Export PNGs from the icon SVG at 1024, 512, 192 and 180 px for favicons and app icons.
- [ ] Create a `rebrand/aqiran-xchange` branch in the web and mobile repos.
- [ ] Run a full-text search for every spelling of the old name: `Dr iTunes Consult`, `DrItunes`, `dritunes`, `Dr. iTunes`, `iTunes Consult`, `dritunesconsult.com`. Save the list — it is your checklist.
- [ ] Split the hits into **customer-facing** (UI text, emails, notifications, page titles, store text, legal pages) and **internal** (database names, package names, env keys, class names). Rename customer-facing ones now. Leave internal ones unless they leak into the UI — renaming them adds risk and gives customers nothing.
- [ ] Back up the production database and note the current app versions in both stores.

**Using Claude Code in your editor.** Your editor's Claude Code can read and change your repos directly, which makes it ideal for the search and replace work here. It can't see this chat or the design canvas, so give it the brand values and asset files explicitly. It may share memory with this account, but don't rely on that — paste the prompts in the last section of this guide. Ask it to list changes before making them, and review each diff before you merge.

## Phase 1 — Domain, email and redirects

Make aqiranxchange.com the main address and have every old link land on the right new page. Customers' bookmarks, shared links and search results all point at dritunesconsult.com today.

- [ ] Point aqiranxchange.com (and `www.`) at the web app and issue SSL certificates for both.
- [ ] Keep dritunesconsult.com registered and renewed for several years, so nobody else can take it.
- [ ] Add **301 permanent redirects** from every old URL to the same path on the new domain — `dritunesconsult.com/anything` → `aqiranxchange.com/anything`, keeping the query string. Example for Nginx:

```
server {
    listen 443 ssl;
    server_name dritunesconsult.com www.dritunesconsult.com;
    # ssl_certificate ... (keep a valid cert on the old domain)
    return 301 https://aqiranxchange.com$request_uri;
}
```

- [ ] **Leave the old API working** if the mobile app calls it. Installed copies of the current app will keep calling the old domain until people update. Serve the API on both domains rather than redirecting POST requests, which many clients won't follow.
- [ ] Set up info@aqiranxchange.com plus any support or no-reply addresses. Add SPF, DKIM and DMARC records for the new domain before sending, or emails will land in spam.
- [ ] Forward mail sent to old @dritunesconsult.com addresses to the new inboxes.
- [ ] Update every third-party setting that stores your domain: payment provider webhooks and callback URLs, OAuth and social-login redirect URIs, reCAPTCHA domains, analytics, CORS allowed origins, and push-notification config.
- [ ] In Google Search Console, verify both domains and use the **Change of Address** tool once the redirects are live.

## Phase 2 — Web app

The steps below assume Laravel with Filament for the admin, and Vue or Next.js with Tailwind for the customer side. Adjust file names if dritunesconsult.com is built differently.

**Laravel (backend)**

- [ ] `.env` on every environment: `APP_NAME="Aqiran Xchange"`, `APP_URL=https://aqiranxchange.com`, `MAIL_FROM_NAME="Aqiran Xchange"`, `MAIL_FROM_ADDRESS=info@aqiranxchange.com`.
- [ ] If you use Sanctum or cookie sessions, add the new domain to `SANCTUM_STATEFUL_DOMAINS` and set `SESSION_DOMAIN`. Expect users to sign in again once, because cookies don't carry across domains.
- [ ] Run `php artisan config:clear` and `php artisan cache:clear` after the change, then rebuild config cache in production.
- [ ] Mail and notifications: replace the logo in the mail theme (`resources/views/vendor/mail` if published), and search notification classes and Blade views for the old name.
- [ ] SMS sender ID: if you send SMS, register the new sender name with your provider. Approval can take days, so start early.

**Filament admin**

- [ ] In your panel provider, set `->brandName('Aqiran Xchange')`, `->brandLogo(asset('images/aqiran-xchange-logo.svg'))`, `->darkModeBrandLogo(asset('images/aqiran-xchange-logo-white.svg'))`, `->brandLogoHeight('2rem')` and `->favicon(asset('favicon.ico'))`.
- [ ] Set the primary colour: `->colors(['primary' => Color::hex('#F5B400')])`. Check button text stays readable; Filament may need a darker shade for text on white.

**Customer front end (Vue or Next.js + Tailwind)**

- [ ] Add brand tokens to Tailwind (`tailwind.config.js` on v3, or `@theme` in your CSS on v4): `gold: #F5B400`, `ink: #141416`, `crimson: #ED1848`. Then replace old brand colour classes.
- [ ] Load Sora from Google Fonts and set it as the sans font.
- [ ] Swap the header and footer logo components for the new SVGs.
- [ ] Next.js: update `metadata` (title template, description, `openGraph`, `twitter`). Vue: update `index.html` `<title>` and meta tags.
- [ ] Replace favicons: `favicon.ico`, `apple-touch-icon.png` (180 px), `icon-192.png` and `icon-512.png`, and update `manifest.json` / `site.webmanifest` (`name`, `short_name`, `theme_color: #F5B400`).
- [ ] Make a new social share image, 1200×630, using the logo on gold.
- [ ] Update terms, privacy policy, footer and "About" text to the new name. Add a line such as "Aqiran Xchange (formerly Dr iTunes Consult)" so returning customers know it's you.
- [ ] Add a dismissible site banner for the first few weeks: "Dr iTunes Consult is now Aqiran Xchange. Same team, same service."

If your registered company name is changing too, check with your local business registry, bank and payment provider what they need. Card or bank statement descriptors often still show the old name until you update them.

## Phase 3 — Mobile app

The steps below assume Flutter with GetX. The most important decision is the app identifier, so make it first.

**The app ID decision**

| Situation | What to do with `applicationId` / Bundle ID |
| --- | --- |
| App is already live in a store | **Keep it.** Changing it creates a brand-new app, so existing users get no update and you lose reviews and installs. Change only the name, icon and listing. |
| App not yet published | Change it now to something like `com.aqiranxchange.app`, before the first release. It can never change after that. |

**In the code**

- [ ] Android display name: `android:label="Aqiran Xchange"` in `android/app/src/main/AndroidManifest.xml`.
- [ ] iOS display name: `CFBundleDisplayName` and `CFBundleName` in `ios/Runner/Info.plist`.
- [ ] `GetMaterialApp(title: 'Aqiran Xchange', ...)` and any app-name strings in your translations.
- [ ] Theme: set `ColorScheme.fromSeed(seedColor: Color(0xFFF5B400))`, or define primary gold and on-primary charcoal explicitly. Add Sora via `google_fonts` or bundled font files.
- [ ] App icon: use `flutter_launcher_icons` with `aqiran-xchange-icon` exported to 1024 px. For Android adaptive icons, use the AQ monogram as the foreground on a gold `#F5B400` background, and keep it inside the safe zone so launchers don't crop it.
- [ ] Splash screen: use `flutter_native_splash` with a gold background and the monogram centred, including the Android 12+ splash settings.
- [ ] Replace in-app logos, onboarding screens and any "Dr iTunes" text found in the Phase 0 search.
- [ ] API base URL: point new builds at aqiranxchange.com, and keep the old domain's API alive for older installs (Phase 1).
- [ ] Deep links: host `/.well-known/assetlinks.json` (Android) and `/.well-known/apple-app-site-association` (iOS) on the new domain, and update the associated domains in the app.
- [ ] Bump the version and build number, then test a fresh install **and** an update over the current version.

**Store listings & App Descriptions (Google Play & Apple App Store)**

- [ ] App name "Aqiran Xchange" fits both stores' 30-character name limit (e.g., `Aqiran Xchange: Trade & Payout`).
- [ ] New icon, feature graphic (Google Play, 1024×500) and screenshots showing the new look.
- [ ] **Short Description (Google Play - max 80 chars):**
  `Trade gift cards for instant cedis. Fast, secure secondary market payouts.`
- [ ] **Full App Description (Copy-paste ready for both Google Play & App Store):**
  ```markdown
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
  1. Select your gift card brand (Apple, Amazon, Steam, Google Play, Razer, etc.) and denomination.
  2. Get a live, transparent quote.
  3. Submit the card claim code or physical card pack photo.
  4. Enter your Mobile Money or Bank details for instant cashout.
  5. Receive funds in your account within minutes!

  IMPORTANT DISCLAIMERS & LEGAL DISCLOSURES:
  • Independent Secondary Marketplace: Aqiran Xchange operates strictly as an independent secondary marketplace for pre-owned, stored-value digital assets.
  • Brand Non-Affiliation: Aqiran Xchange is NOT affiliated with, sponsored by, endorsed by, authorized by, or in any way officially associated with Apple Inc., Amazon.com, Inc., Valve Corporation (Steam), Google LLC, Razer Inc., Sony Interactive Entertainment, Microsoft Corporation, or any other trademark owner whose products are referenced.
  • Trademark Notice: All trademarks, service marks, product names, emblems, and logos referenced within this app are the registered intellectual property of their respective owners. Their mention is strictly for descriptive, nominative fair use to identify the secondary gift cards being exchanged by consumers.
  • Zero KYC: We do not collect government-issued ID documents or biometric selfies. We collect basic account credentials and financial payout details (MoMo / bank info) strictly to execute your trade disbursements.

  Need assistance? Visit our counter in Tamale or email info@aqiranxchange.com.
  ```
- [ ] **Google Play Data Safety Form Questionnaire Answers:**
  - **Financial Info:** Select **"Yes, collected"** and **"Yes, shared"** (with regulated payment processors for payout disbursement). Category: *Bank account details & other financial info (Mobile Money phone numbers)*. Ephemeral: *No*. Optional: *Yes* (only needed to receive cashouts). Purpose: *App functionality, Fraud prevention*.
  - **Personal Info:** Select **"Yes, collected"** for *Name, Email address, Phone number*. Shared: *No*. Purpose: *Account management, Communications*.
  - **Government-issued IDs / Biometrics:** Select **"No"** (Aqiran Xchange does NOT conduct KYC or collect identity documents).
  - **Security Practices:** Data encrypted in transit (TLS/HTTPS); Account deletion mechanism provided directly in-app and at `aqiranxchange.com/auth/delete-account`.
- [ ] **Apple Privacy Nutrition Labels (App Store Connect):**
  - **Data Used to Track You:** *None*.
  - **Data Linked to You:**
    - *Financial Info (Payment Information)*: Bank account and Mobile Money credentials for payouts.
    - *Contact Info*: Email Address, Name, Phone Number.
    - *User Content*: Gift card photos / codes for trade processing.
  - **Data Not Linked to You:**
    - *Diagnostics*: Crash Data & Performance Data (via Sentry).
- [ ] Update the support URL (`https://aqiranxchange.com/contact`), privacy policy URL (`https://aqiranxchange.com/privacy`), developer contact email (`info@aqiranxchange.com`), and in Play Console, the developer name.
- [ ] Release notes: "We're now Aqiran Xchange (formerly Dr iTunes Consult). Same trusted team, same instant payouts, fresh new look with enhanced trade tracking."
- [ ] Optional: add a minimum-version check so very old builds pointing at retired endpoints are asked to update.

## Phase 4 — Customer communication and launch day

Customers trading gift cards are wary of scams, so the main job is proving the new name is really you. Announce from your existing, trusted channels first, before anything goes out under the new name.

**Before launch day**

- [ ] Announce from the **old** accounts first: the current website banner, existing WhatsApp number, social pages and email list. Say clearly: "Dr iTunes Consult is now Aqiran Xchange", with the new website address.
- [ ] Rename social media profiles and handles where possible, rather than creating new accounts, so followers carry over. Update profile pictures with the app icon.
- [ ] Update your Google Business Profile, WhatsApp Business name and profile picture.
- [ ] Brief anyone who talks to customers on what to say, and on the warning below.

**Launch day checklist**

- [ ] Redirects from dritunesconsult.com tested on the home page, login, a deep page and the API.
- [ ] Sign up, log in, submit a gift card trade and receive a payout end-to-end on the new domain.
- [ ] Transactional emails arrive in the inbox (not spam) from the new address.
- [ ] Filament admin works on the new domain.
- [ ] Mobile update approved and live, or submitted with phased rollout.
- [ ] Post the three rebrand flyers (torn poster, name tag, now arriving) across your channels over the first week, then the gift card flyers.
- [ ] Send an email to all customers with the announcement and the new links.

**Scam warning to include in your announcement:** "We will never ask for your gift card codes outside our website or app. Only trust aqiranxchange.com and our official accounts." Rebrands are a common moment for impersonators.

## Phase 5 — After launch

Watch closely for the first two weeks, then clean up slowly. Removing old things too early is the usual cause of rebrand breakage.

| When | Check or do |
| --- | --- |
| Daily, first 2 weeks | Server logs for 404s and failed redirects; app crash reports; support messages from confused customers; email deliverability |
| Week 2 | Search Console coverage on the new domain; old domain traffic still redirecting |
| Month 1 | Remove the site banner; drop "formerly Dr iTunes Consult" from most places but keep it in About and the store description |
| Month 3 | Check how much traffic still arrives via the old domain and old API; plan a minimum-version update if older app builds still call it |
| Month 12+ | Consider retiring the old API host. Keep the old domain registered and redirecting indefinitely |

Only rename internal identifiers (database names, package names, repository names) later, as a separate low-risk task, if they bother you at all.

## Prompts to paste into Claude Code

Run these in your editor, one at a time, inside the right repo. Each starts by listing changes so you can review before anything is edited.

**1. Audit (both repos)**

```
We are rebranding "Dr iTunes Consult" (dritunesconsult.com) to "Aqiran Xchange" (aqiranxchange.com, info@aqiranxchange.com). Search this repo for every occurrence of the old name in any spelling (Dr iTunes Consult, DrItunes, dritunes, Dr. iTunes, iTunes Consult, dritunesconsult.com). Do not change anything yet. Give me a table: file, line, current text, and whether it is customer-facing (UI, emails, notifications, page titles, legal text) or internal (DB, package names, env keys, class names).
```

**2. Web app (Laravel + Filament + front end)**

```
Apply the rebrand to the customer-facing items from the audit. Brand: name "Aqiran Xchange"; primary gold #F5B400; ink #141416; accent crimson #ED1848; font Sora. Logo files are in public/images: aqiran-xchange-logo.svg and aqiran-xchange-logo-white.svg. Update APP_NAME and mail-from in .env.example, the Filament panel provider (brandName, brandLogo, darkModeBrandLogo, favicon, primary colour), Tailwind theme tokens, page titles and meta/Open Graph tags, the web manifest, mail templates and notification text. Do not rename database tables, migrations, package names or env keys. Show me the plan first, then make the changes in small commits.
```

**3. Mobile app (Flutter + GetX)**

```
Apply the rebrand to this Flutter app. Display name "Aqiran Xchange" on Android (AndroidManifest android:label) and iOS (CFBundleDisplayName, CFBundleName); GetMaterialApp title; theme primary #F5B400 with #141416 text on primary; Sora font. Set up flutter_launcher_icons with assets/branding/aqiran-xchange-icon.png (adaptive icon: monogram foreground on #F5B400 background) and flutter_native_splash with a #F5B400 background. Point the API base URL to aqiranxchange.com. Do NOT change applicationId or the iOS bundle identifier. List the files you will change first.
```

**4. Redirects and domain config**

```
Write the server config to 301-redirect every path on dritunesconsult.com and www.dritunesconsult.com to the same path on https://aqiranxchange.com, keeping query strings, except the API routes under /api which should be served directly on both domains. Use our current web server (check the repo or ask me which: Nginx, Apache or a hosting panel).
```
