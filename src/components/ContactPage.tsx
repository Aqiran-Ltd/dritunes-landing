"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, MapPinIcon, ArrowRightIcon, ClockIcon, ShieldCheckIcon, StarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { fetchSocials, Socials } from "@/lib/socialService";
import { useEffect } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socials, setSocials] = useState<Socials | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchSocials().then(setSocials);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: `${formData.message}\n\nPhone: ${formData.phone}`
      });
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-10" />
      
      {/* Animated Background Shapes */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-64 h-64 bg-red-500 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-3xl"
      />
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-8 shadow-lg"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image
                src="/logo/white.png"
                alt="Dr iTunes Logo"
                fill
                className="object-contain"
              />
            </div>
            <CheckCircleIcon className="w-4 h-4 mr-2 text-red-400" />
            Get In Touch
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-gradient">Start Trading</span>?
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Dr iTunes Consult for their crypto and gift card trading needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Send us a Message</h3>
                  <p className="text-gray-300">We&apos;ll get back to you within 24 hours</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm cursor-text"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm cursor-text"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm cursor-text"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm cursor-text"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your trading needs..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm resize-none cursor-text"
                    required
                  />
                </div>
                
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02, y: -3 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSubmitting}
                  className={`group w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Phone Support</h3>
                  <p className="text-gray-300 font-medium">{socials?.whatsapp || "+233548434599"}</p>
                  <p className="text-sm text-white/60">Available 24/7</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">WhatsApp & Telegram</h3>
                  <p className="text-gray-300 font-medium">{socials?.whatsapp || "+233548434599"}</p>
                  <p className="text-sm text-white/60">Instant messaging</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email</h3>
                  <p className="text-gray-300 font-medium">dr.itunesconsult@gmail.com</p>
                  <p className="text-sm text-white/60">Business inquiries</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Location</h3>
                  <p className="text-gray-300 font-medium">Tamale, Northern Region, Ghana</p>
                  <p className="text-sm text-white/60">Serving all of Ghana</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href={socials?.whatsapp ? `https://wa.me/${socials.whatsapp.replace(/\D/g, '')}` : "https://wa.me/233548434599"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg text-center flex items-center justify-center cursor-pointer"
            >
              Chat on WhatsApp Now
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-red-400" />
                Why Trust Us?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">5+ Years of Experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">1,000+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">24/7 Customer Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Secure Transactions</span>
                </div>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-8 h-8 text-white" />
                <div>
                  <h4 className="text-lg font-bold text-white">Fast Response</h4>
                  <p className="text-red-100 text-sm">We reply within 5 minutes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Social Media Grid Section */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="mt-24 pt-16 border-t border-white/10"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect on <span className="text-gradient">Social Media</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Follow us for real-time rate updates, crypto news, and exclusive trading offers across all our official channels.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Facebook", icon: "FB", href: socials?.facebook || "#", color: "from-blue-600 to-blue-700", label: "Join our Community" },
              { name: "Instagram", icon: "IG", href: socials?.instagram || "#", color: "from-pink-500 to-purple-600", label: "Lifestyle & Updates" },
              { name: "Telegram", icon: "TG", href: socials?.telegram || "#", color: "from-blue-400 to-blue-500", label: "Instant Trading" },
              { name: "TikTok", icon: "TK", href: socials?.tiktok || "#", color: "from-gray-800 to-black", label: "Trading Tips" },
              { name: "X (Twitter)", icon: "X", href: socials?.x_twitter || "#", color: "from-gray-900 to-gray-700", label: "Market News" },
              { name: "YouTube", icon: "YT", href: socials?.youtube || "#", color: "from-red-600 to-red-700", label: "Video Tutorials" }
            ].map((social, idx) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${social.color} rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {social.icon === "FB" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  )}
                  {social.icon === "IG" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  )}
                  {social.icon === "TG" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  )}
                  {social.icon === "TK" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  )}
                  {social.icon === "X" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  )}
                  {social.icon === "YT" && (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  )}
                </div>
                <span className="text-white font-bold group-hover:text-red-400 transition-colors uppercase tracking-widest text-[10px]">{social.name}</span>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-[9px] font-medium text-center leading-tight mt-1">{social.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 