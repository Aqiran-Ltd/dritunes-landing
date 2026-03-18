"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams as nextSearchParams, useRouter as nextRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

function UnsubscribeContent() {
  const searchParams = nextSearchParams();
  const router = nextRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");

    if (!email) {
      setStatus("error");
      setMessage("Invalid unsubscribe link. Email address is missing.");
      return;
    }

    const unsubscribe = async () => {
      try {
        await api.get(`/newsletter/unsubscribe?email=${email}`);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to unsubscribe. You may have already been removed or the link is invalid.");
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {status === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unsubscribing you...</h2>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">You&apos;re Unsubscribed</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            We&apos;re sorry to see you go! You have been successfully removed from our newsletter list. We hope to see you back soon.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors group"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Resubscribe
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-red-100 dark:border-red-900/30 text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <NoSymbolIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Unsubscribe Failed</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            Visit Our Website
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin" />
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
