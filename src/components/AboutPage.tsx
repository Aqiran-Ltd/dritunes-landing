"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  LightBulbIcon, 
  RocketLaunchIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";

// Floating Particles Component
const FloatingParticles = () => {
  const [mounted, setMounted] = React.useState(false);
  const [particles, setParticles] = React.useState<{id:number,x:number,y:number,size:number,duration:number,delay:number}[]>([]);

  React.useEffect(() => {
    setMounted(true);
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(p);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 25, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Service type definition
interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

// Interactive Service Card
const ServiceCard = ({ service }: { service: Service }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: service.delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
        >
          <service.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Hover Effect */}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
        />


      </div>
    </motion.div>
  );
};

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const services: Service[] = [
    {
      icon: CurrencyDollarIcon,
      title: "Cryptocurrency & P2P Trading Education",
      description: "Expert-led workshops, seminars, and one-on-one mentorship on trading via platforms like Binance, Kucoin, and Bybit.",
      gradient: "from-green-500 to-green-600",
      delay: 0.1
    },
    {
      icon: ComputerDesktopIcon,
      title: "Tech & Digital Literacy Bootcamps",
      description: "Practical ICT and coding sessions targeted at youth from rural and underserved communities in Northern Ghana.",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: BuildingOfficeIcon,
      title: "Business Digitalization Consulting",
      description: "Tailored support for SMEs and startups looking to transition their operations online.",
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: AcademicCapIcon,
      title: "Web & Software Development",
      description: "High-quality, secure web applications, e-learning platforms, digital portfolios, and database systems.",
      gradient: "from-orange-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: GlobeAltIcon,
      title: "Community Innovation Hubs",
      description: "Plans underway to launch innovation hubs and ICT labs to provide access to tools, internet, and training.",
      gradient: "from-red-500 to-red-600",
      delay: 0.5
    }
  ];

  const achievements = [
    "Trained over 500 youth in crypto trading fundamentals and safe digital practices.",
    "Spearheaded AITES Dream Tour, a tech-cultural project encouraging tech students to explore Ghana's heritage.",
    "Developed several in-house and client-based digital platforms and automated systems.",
    "Built strategic partnerships with local institutions to promote tech awareness and financial inclusion."
  ];

  const futurePlans = [
    "Establish physical digital learning centers across Northern Ghana.",
    "Expand into fintech tools that allow African users to engage with digital assets more easily.",
    "Launch a scholarship program for underprivileged but talented youth.",
    "Partner with NGOs, government agencies, and global blockchain platforms."
  ];

  return (
    <div className="pt-20 pb-16 relative">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Creative Background Elements */}
        <div className="absolute inset-0 bg-pattern opacity-30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <FloatingParticles />
        
        {/* Floating Shapes */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-red-600 rounded-full opacity-15 blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-25 blur-lg"
        />
        
        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Logo and Site Name - Creative Side-by-Side Placement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-8 flex flex-col items-center justify-center md:flex-row md:space-x-8 md:mb-12"
          >
            {/* Logo */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mb-4 md:mb-0 drop-shadow-xl"
            >
              <Image
                src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                alt="Dr iTunes Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            {/* Site Name and Tagline */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-5xl md:text-7xl font-black leading-tight relative flex items-center"
              >
                <span className="text-gradient animate-pulse-slow drop-shadow-lg pr-2">Dr iTunes</span>
                <span className="inline-block align-super animate-bounce text-yellow-400 ml-1">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-7 h-7">
                    <path d="M12 2v2m0 16v2m8-8h2M2 12H4m13.657-6.343l1.414 1.414M4.929 19.071l1.414-1.414m12.728 0l-1.414-1.414M4.929 4.929l1.414 1.414" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </motion.h1>
              <span className="text-gray-900 dark:text-white text-2xl md:text-4xl font-extrabold tracking-tight block mt-2 animate-gradient-x bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                Consult
              </span>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-xl font-medium mt-4"
              >
                <span className="inline-block align-middle mr-2 animate-bounce text-yellow-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5">
                    <path d="M12 2v2m0 16v2m8-8h2M2 12H4m13.657-6.343l1.414 1.414M4.929 19.071l1.414-1.414m12.728 0l-1.414-1.414M4.929 4.929l1.414 1.414" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Empowering Ghana&apos;s Digital Future
              </motion.p>
          </div>
          </motion.div>

          {/* Company Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Founded by visionary IT entrepreneur Alhassan Abdul-Hanan, popularly known as Dr. iTunes, 
              Dr iTunes Consult (Global Limited) is a forward-thinking digital consultancy dedicated to 
              empowering youth and businesses across Northern Ghana through education in digital innovation, 
              cryptocurrency, and financial technologies.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Rooted in deep community values and futuristic thinking, the company is designed to bridge 
              the gap between underprivileged regions and the rapidly evolving global digital economy.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-red-600 dark:border-red-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-red-600 dark:bg-red-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
            >
              <div className="relative w-6 h-6 mr-3">
                <Image
                  src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                  alt="Dr iTunes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <LightBulbIcon className="w-4 h-4 mr-2 text-red-500" />
              Our Vision & Mission
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-gradient">Vision & Mission</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Driving digital transformation and empowering communities through innovative education and technology.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 shadow-lg">
                  <LightBulbIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Vision
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  To become the leading digital transformation consultancy in West Africa, pioneering 
                  inclusive tech education and innovation that uplifts communities and unlocks economic freedom.
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                  <RocketLaunchIcon className="w-8 h-8 text-white" />
        </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h3>
                <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                  {[
                    "Educate and mentor youth on cryptocurrency, blockchain, and digital finance.",
                    "Provide consultancy services in digital business setup, website development, and P2P trading.",
                    "Promote digital literacy and entrepreneurial skills in underserved regions.",
                    "Build digital ecosystems that create sustainable income streams for the African youth."
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-3 mr-4 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
          </ul>
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
            >
              <div className="relative w-6 h-6 mr-3">
                <Image
                  src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                  alt="Dr iTunes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <CurrencyDollarIcon className="w-4 h-4 mr-2 text-red-500" />
              Our Core Services
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-gradient">Core Services</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive digital solutions designed to empower communities and drive innovation.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center mx-auto"
            >
              Explore Our Services
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Founder's Background Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
            >
              <div className="relative w-6 h-6 mr-3">
                <Image
                  src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                  alt="Dr iTunes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <UserGroupIcon className="w-4 h-4 mr-2 text-red-500" />
              Meet Our Founder
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-gradient">Founder&apos;s Background</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The visionary behind Dr iTunes Consult and his journey in digital transformation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                <p>
                  Alhassan Abdul-Hanan (Dr. iTunes) is a Ghanaian tech entrepreneur, digital educator, 
                  and cryptocurrency trader. He served as President of the Computer Science Department 
                  and the Association of Information Technology Students (AITES) at Tamale Technical University.
                </p>
                <p>
                  Dr. iTunes began his journey in cryptocurrency trading in 2018, and since then, has gained 
                  mastery in peer-to-peer (P2P) exchanges and blockchain technologies. His passion for education, 
                  impact, and digital inclusion led to the founding of Dr iTunes Consult to mentor the next 
                  generation of African tech innovators.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Leadership Experience
                </h3>
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                  {[
                    "President of Computer Science Department at Tamale Technical University",
                    "President of Association of Information Technology Students (AITES)",
                    "Led several student-driven technology projects and election automation tools"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
        </ul>
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements & Future Plans Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 bg-red-100 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8 shadow-lg"
            >
              <div className="relative w-6 h-6 mr-3">
                <Image
                  src={mounted && resolvedTheme === 'dark' ? "/logo/white.png" : "/logo/red-black.png"}
                  alt="Dr iTunes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <CheckCircleIcon className="w-4 h-4 mr-2 text-red-500" />
              Our Journey & Future
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-gradient">Journey & Future</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Celebrating our achievements and planning for an even brighter future.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Key Achievements
              </h3>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="group relative"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 float-left">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-12">
                        {achievement}
                      </p>
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Future Plans
              </h3>
              <div className="space-y-6">
                {futurePlans.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: -10 }}
                    className="group relative"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 float-left">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-12">
                        {plan}
                      </p>
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 