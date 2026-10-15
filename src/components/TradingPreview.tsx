"use client";

import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { audit } from "@/lib/audit";
import { 
  ArrowRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/outline";

// Deterministic pseudo-random hash — same seed always produces the same value.
// Used instead of Math.random() so particle positions are stable across re-renders.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function TradingPreview() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const particles = useMemo(
    () => Array.from({ length: 15 }, (_, i) => ({ left: pseudoRandom(i) * 100, top: pseudoRandom(i + 100) * 100 })),
    []
  );

  const giftCards = [
    {
      name: "Amazon Gift Card",
      rate: "₵15.50",
      status: "Available",
      icon: "🛒",
      color: "from-orange-400 to-red-500"
    },
    {
      name: "Apple Gift Card",
      rate: "₵15.80",
      status: "Available",
      icon: "🍎",
      color: "from-gray-600 to-gray-800"
    },
    {
      name: "Google Play Card",
      rate: "₵15.30",
      status: "Available",
      icon: "🎮",
      color: "from-green-400 to-blue-500"
    }
  ];

  const tradingFeatures = [
    {
      icon: BoltIcon,
      title: "Lightning Fast",
      description: "Complete trades in under 30 seconds",
      metric: "< 30s",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Grade Security",
      description: "256-bit encryption with 2FA protection",
      metric: "99.9%",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: ChartBarIcon,
      title: "Best Rates",
      description: "Competitive rates with zero hidden fees",
      metric: "0%",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: GlobeAltIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      metric: "24/7",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.2),transparent_50%)]" />
        <motion.div
          style={{ y }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full opacity-30"
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8,
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-8 shadow-2xl"
          >
            <RocketLaunchIcon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent"
          >
            Next-Gen Trading
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of digital trading with our cutting-edge platform. 
            Trade gift cards with unmatched speed, security, and convenience.
          </motion.p>
        </motion.div>

        {/* Trading Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm ml-4 font-mono">Aqiran Xchange Trading Terminal</span>
              </div>
              <div className="text-green-400 text-sm font-mono">● LIVE</div>
            </div>

            {/* Trading Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {giftCards.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {card.icon}
                    </div>
                    <div className="text-green-400 text-sm">● {card.status}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
                  <div className="text-2xl font-bold text-white mb-2">{card.rate}</div>
                  <div className="text-sm text-gray-400">per $1</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {tradingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{feature.description}</p>
                <div className="text-2xl font-bold text-white">{feature.metric}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Multi-Platform Trading</h3>
              <p className="text-gray-300">Trade anywhere, anytime with our mobile and web platforms</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/30"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-blue-400" />
                  <h4 className="text-white font-bold text-lg">Mobile App</h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">Trade on the go with our intuitive mobile app</p>
                <div className="flex items-center space-x-2 text-blue-400">
                  <span className="text-sm">Download App</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-6 rounded-2xl border border-green-500/30"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <ComputerDesktopIcon className="w-8 h-8 text-green-400" />
                  <h4 className="text-white font-bold text-lg">Web Platform</h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">Advanced trading tools on desktop</p>
                <div className="flex items-center space-x-2 text-green-400">
                  <span className="text-sm">Launch Platform</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => audit.log('cta_click', { location: 'trading_preview', label: 'Start Trading Now' })}
            className="group px-12 py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 text-xl mb-6 flex items-center mx-auto"
          >
            <FireIcon className="w-6 h-6 mr-2 group-hover:animate-bounce" />
            Start Trading Now
            <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
          <p className="text-gray-400 text-lg">
            Join 10,000+ traders across Ghana
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
} 