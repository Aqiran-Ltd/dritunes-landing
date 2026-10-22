"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExclamationTriangleIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function DeleteAccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<"warning" | "confirm">("warning");
  const [error, setError] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && email.toLowerCase() !== user.email.toLowerCase()) {
      setError("Email does not match your currently logged-in account.");
      return;
    }
    setError("");
    setIsDeleting(true);

    try {
      let token = localStorage.getItem("access_token");
      
      // If no token in storage (e.g. user visited via direct URL while logged out), authenticate first
      if (!token) {
        try {
          const loginRes: any = await api.post("/auth/login", { email, password });
          token = loginRes?.token || loginRes?.data?.token || loginRes?.access_token || localStorage.getItem("access_token");
        } catch (loginErr: any) {
          throw new Error(loginErr.message || "Invalid credentials. Please verify your email and password.");
        }
      }
      
      // Call backend DELETE /api/v1/auth/delete
      const res: any = await api.delete("/auth/delete", token || undefined, { email, password });
      
      toast.success(res?.message || "Your account has been permanently deleted.");
      await logout();
      router.push("/");
    } catch (err: any) {
      console.error("Account Deletion Error:", err);
      setError(err.message || "Failed to delete account. Please check your credentials.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 shadow-inner mb-2">
          <ShieldExclamationIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Delete Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Permanently delete your Aqiran Xchange account and associated data.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "warning" ? (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Warning Callout */}
            <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                    Irreversible Action
                  </h3>
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
                    Deleting your account will:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-red-700 dark:text-red-400">
                    <li>Permanently erase your trade history and rates records.</li>
                    <li>Securely purge your KYC verification documents.</li>
                    <li>Cancel any active or pending transactions.</li>
                    <li>Revoke all connected mobile money and bank payout methods.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("confirm")}
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>I Understand, Continue to Verification</span>
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Keep My Account</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleDelete} className="space-y-4">
              <Input
                type="email"
                label="Confirm Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={<EnvelopeIcon className="w-5 h-5" />}
              />

              <Input
                type="password"
                label="Verify Your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                icon={<LockClosedIcon className="w-5 h-5" />}
              />

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isDeleting || !password || !email}
                  className={`w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 ${
                    isDeleting || !password || !email ? "opacity-60 cursor-not-allowed" : "active:scale-[0.99]"
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4" />
                      <span>Permanently Delete My Account</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep("warning")}
                  disabled={isDeleting}
                  className="w-full py-2.5 text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  Go back to warnings
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
        Need assistance or have an unresolved dispute?{" "}
        <Link href="/contact" className="font-semibold text-gold-700 dark:text-gold-400 hover:underline">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
