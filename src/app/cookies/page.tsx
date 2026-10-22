import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

const intro = "How Aqiran Xchange uses cookies to improve your digital experience.";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Aqiran Xchange Cookie Policy. Learn how we use essential, functional, and performance cookies to power our gift card exchange platform on web and mobile browsers.",
};

const sections: LegalSection[] = [
  {
    "title": "What Are Cookies?",
    "content": "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site."
  },
  {
    "title": "Essential Cookies",
    "content": "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as accessing secure areas that require authentication."
  },
  {
    "title": "Performance and Analytics",
    "content": "These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you."
  },
  {
    "title": "Functionality Cookies",
    "content": "These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your choice of language or region)."
  },
  {
    "title": "Managing Your Cookies",
    "content": "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. If you choose to reject cookies, you may still use our website though your access to some functionality may be restricted."
  }
];

export default function Page() {
  return <LegalPage title="Cookie Policy" badge="Transparency & Control" intro={intro} updated="October 22, 2026" sections={sections} />;
}
