"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, ArrowDown, Shield, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback } from "react";

export default function Hero() {

  const scrollToFeatures = useCallback(() => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);



  return (
    <section className="relative isolate flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-20">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/60 to-black/90" />
        
        {/* Subtle animated mesh */}
        <motion.div 
          animate={{
            background: [
              "radial-gradient(circle at 30% 40%, rgba(30, 58, 138, 0.1) 0%, transparent 60%)",
              "radial-gradient(circle at 70% 60%, rgba(30, 58, 138, 0.1) 0%, transparent 60%)",
              "radial-gradient(circle at 30% 40%, rgba(30, 58, 138, 0.1) 0%, transparent 60%)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            backgroundPosition: ['0px 0px', '60px 60px'],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        />
      </div>

      {/* Subtle floating elements */}
      <motion.div 
        animate={{
          y: [-10, 10, -10],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 -z-10 transform-gpu blur-3xl" 
        aria-hidden="true"
      >
        <div className="h-96 w-96 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5" />
      </motion.div>
      
      <motion.div 
        animate={{
          y: [8, -8, 8],
          opacity: [0.02, 0.05, 0.02]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-1/4 left-1/4 -z-10 transform-gpu blur-3xl" 
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-r from-slate-600 to-blue-700 opacity-3" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center px-8 sm:px-16 lg:px-32 xl:px-40 max-w-6xl relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mb-10 flex justify-center"
        >
          <motion.span 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center rounded-full bg-green-500/10 px-5 py-2.5 text-sm font-medium text-green-300 ring-1 ring-inset ring-green-400/20 backdrop-blur-sm font-sans"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Live Now - Trusted by 10,000+ Businesses
          </motion.span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-8 font-sans tracking-tight"
        >
          <span className="block bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-3">
            Smart Analytics for
          </span>
          <span className="block text-white font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
            Growing Businesses
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-sans font-normal"
        >
          Join thousands of successful businesses already using our AI-powered analytics platform to make smarter decisions and drive growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -1 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-gray-100 shadow-lg hover:shadow-xl px-7 py-3 text-base font-semibold rounded-lg transition-all duration-300 border-0 font-sans"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -1 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToFeatures}
              className="border border-white/30 text-white hover:bg-white/5 backdrop-blur-sm px-7 py-3 text-base font-semibold rounded-lg transition-all duration-300 hover:border-white/50 bg-transparent font-sans"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              View Features
            </Button>
          </motion.div>
        </motion.div>



        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 from 2,500+ reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>10,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Enterprise Security</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed font-sans">
            Start your free 14-day trial today and see why leading businesses choose IBIAS for their analytics needs.
          </p>
        </motion.div>
      </motion.div>


    </section>
  );
}