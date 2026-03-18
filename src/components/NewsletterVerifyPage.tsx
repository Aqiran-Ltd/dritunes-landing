"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams as nextSearchParams, useRouter as nextRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

function VerifyContent() {
  const searchParams = nextSearchParams();
  const router = nextRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/newsletter/verify?token=${token}&email=${email}`);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to verify subscription. The link may have expired.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying your subscription...</h2>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-green-100 dark:border-green-900/30 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
            <div className="mb-6 relative inline-block">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto"
              >
                <CheckCircleIcon className="w-16 h-16 text-green-600 dark:text-green-400" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 text-yellow-400"
              >
                <SparklesIcon className="w-10 h-10" />
              </motion.div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Confirmed! 🎉</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Welcome to Dr iTunes Consult! You&apos;re now officially on the list for exclusive trading insights and updates.
            </p>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">Redirecting to home in {countdown} seconds...</p>
              <button
                onClick={() => router.push("/")}
                className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-xl flex items-center justify-center hover:bg-black dark:hover:bg-gray-100 transition-colors group"
              >
                Take me home now
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-red-100 dark:border-red-900/30 text-center"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NewsletterVerifyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
