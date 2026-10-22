import { Metadata } from "next";
import DeleteAccountPage from "@/components/DeleteAccountPage";

export const metadata: Metadata = {
  title: "Delete Account",
  description: "Permanently delete your Aqiran Xchange account and associated saved payout data.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <DeleteAccountPage />;
}
