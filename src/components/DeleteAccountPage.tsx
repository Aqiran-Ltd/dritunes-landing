"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExclamationTriangleIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  ShieldExclamationIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function DeleteAccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<"warning" | "confirm">("warning");
  const [error, setError] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== user?.email && user) {
      setError("Email does not match your current account.");
      return;
    }
    setError("");
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("access_token");
      
      // Attempt to delete account
      await api.delete("/auth/delete", token || undefined, { email, password });
      
      toast.success("Your account has been permanently deleted.");
      await logout(); // Clear local state and go to login
    } catch (err: any) {
      console.error("Account Deletion Error:", err);
      // Small shake animation could be triggered here by setting an error state
      setError(err.message || "Failed to delete account. Please check your password.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Danger Zone Background Patterns */}
      <div className="absolute inset-0 bg-pattern opacity-[0.03]" />
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 overflow-hidden relative z-10"
      >
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center shadow-inner">
              <ShieldExclamationIcon className="w-10 h-10 text-red-600 dark:text-red-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">
            Delete Account
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            This action is irreversible. Proceed with extreme caution.
          </p>

          <AnimatePresence mode="wait">
            {step === "warning" ? (
              <motion.div
                key="warning"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl mb-8">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-500 mr-3 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Warning: Permanent Data Loss</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400 space-y-2">
                        <p>If you delete your Dr iTunes Consult account:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>All your trade history will be permanently erased.</li>
                          <li>Your verification (KYC) data will be securely purged.</li>
                          <li>Any pending transactions will be cancelled unconditionally.</li>
                          <li>You will lose all active newsletter subscriptions.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setStep("confirm")}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    I Understand, Set Up Deletion
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Cancel and Keep My Account
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <form onSubmit={handleDelete} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm font-medium text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password Verification
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password to authorize"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 dark:text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button
                      type="submit"
                      disabled={isDeleting || !password || !email}
                      className={`w-full py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                        isDeleting || !password || !email ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Deleting Account...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="w-5 h-5 mr-2" />
                          Permanently Delete Account
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep("warning")}
                      disabled={isDeleting}
                      className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
                    >
                      Wait, take me back
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
