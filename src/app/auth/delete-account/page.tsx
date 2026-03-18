import { Metadata } from "next";
import DeleteAccountPage from "@/components/DeleteAccountPage";

export const metadata: Metadata = {
  title: "Delete Account | Dr iTunes Consult",
  description: "Permanently delete your Dr iTunes Consult account and data.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <DeleteAccountPage />;
}
