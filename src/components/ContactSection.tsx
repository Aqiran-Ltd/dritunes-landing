"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, MapPinIcon, ArrowRightIcon, ClockIcon, ShieldCheckIcon, StarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

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
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto relative z-10">
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
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-gradient">Start Trading</span>?
          </h2>
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
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm cursor-text"
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
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm resize-none cursor-text"
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
                  <p className="text-gray-300 font-medium">+233 XX XXX XXXX</p>
                  <p className="text-sm text-gray-400">Available 24/7</p>
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
                  <h3 className="text-lg font-bold text-white">WhatsApp</h3>
                  <p className="text-gray-300 font-medium">+233 XX XXX XXXX</p>
                  <p className="text-sm text-gray-400">Instant messaging</p>
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
                  <p className="text-gray-300 font-medium">info@dritunesconsult.com</p>
                  <p className="text-sm text-gray-400">Business inquiries</p>
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
                  <p className="text-gray-300 font-medium">Tamale, Northern Region</p>
                  <p className="text-sm text-gray-400">Serving all of Ghana</p>
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
              href="https://wa.me/233XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg text-center flex items-center justify-center"
            >
              💬 Chat on WhatsApp Now
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
      </div>
    </section>
  );
} 