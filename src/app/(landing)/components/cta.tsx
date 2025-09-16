"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  Rocket, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Timer
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow Solutions",
    company: "E-commerce",
    quote: "IBIAS increased our revenue by 127% in just 3 months. The AI recommendations are incredibly accurate.",
    avatar: "SC",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder, GrowthLab",
    company: "SaaS",
    quote: "Setup took 5 minutes. Results came in 24 hours. This is the future of business intelligence.",
    avatar: "MR",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "COO, RetailMax",
    company: "Retail",
    quote: "Finally, analytics that actually help us make decisions. Our team productivity increased 3x.",
    avatar: "EW",
    rating: 5
  }
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const updateTimer = useCallback(() => {
    setTimeLeft(prev => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
      }
      return { hours: 23, minutes: 59, seconds: 59 };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const formattedTime = useMemo(() => {
    return `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  }, [timeLeft]);

  return (
    <div className="flex items-center gap-2 text-orange-400">
      <Timer className="w-4 h-4" />
      <span className="font-mono text-sm">
        {formattedTime}
      </span>
    </div>
  );
};

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const rotateTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(rotateTestimonial, 4000);
    return () => clearInterval(interval);
  }, [isVisible, rotateTestimonial]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Enhanced Floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400/40 rounded-full animate-ping blur-sm" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400/40 rounded-full animate-ping blur-sm" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-cyan-400/40 rounded-full animate-ping blur-sm" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          

          
          {/* Enhanced Main CTA Container */}
          <div className="relative bg-gradient-to-br from-white/15 via-white/8 to-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 overflow-hidden shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500 group">
            
            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-purple-500/40 via-cyan-500/40 to-blue-500/40 rounded-3xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="absolute inset-[2px] bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95 rounded-3xl"></div>
            
            {/* Enhanced Floating orbs inside container */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-xl animate-pulse group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-pulse group-hover:scale-110 transition-transform duration-500" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -left-3 w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute top-1/4 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-sm animate-float" />
            
            <div className="relative p-8 lg:p-16 z-10">
              
              {/* Trust Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">14-day free trial • No credit card required</span>
                </div>
              </div>

              {/* Main CTA Content */}
              <div className="text-center max-w-6xl mx-auto space-y-8">
                
                {/* Enhanced Headline */}
                <div className="space-y-8">

                  <h2 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    <span className="block text-white mb-6">Ready to</span>
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      10X Your Growth?
                    </span>
                  </h2>
                  
                  <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                    Join <span className="text-blue-300 font-bold bg-blue-500/10 px-2 py-1 rounded-lg">10,000+ businesses</span> already using IBIAS to 
                    transform their analytics and accelerate growth.
                  </p>
                  
                  {/* Urgency indicator */}
                  <div className="flex items-center justify-center gap-3 text-orange-400 bg-orange-500/10 rounded-lg px-4 py-3 border border-orange-500/20 max-w-md mx-auto">
                    <CountdownTimer />
                    <span className="text-sm font-medium">Limited time: 50% off first 3 months</span>
                  </div>
                </div>
                
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
                  <Link href="/auth?mode=signup">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto group relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 text-white border-2 border-blue-400/50 hover:border-blue-300/70 shadow-2xl hover:shadow-blue-500/50 text-lg px-10 py-5 h-auto rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <Rocket className="w-6 h-6 mr-3 relative z-10" />
                      <span className="relative z-10">Start Free Trial Now</span>
                      <span className="text-sm opacity-90 relative z-10">• No Credit Card</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signin">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto group bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/60 text-lg px-10 py-5 h-auto rounded-2xl font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <Users className="w-6 h-6 mr-3 relative z-10" />
                      <span className="relative z-10">Sign In</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
                    </Button>
                  </Link>
                </div>
                
                {/* Simple Trust Elements */}
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mt-8">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Setup in 5 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>

                {/* Customer Statistics */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                   <div className="group p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">10K+</div>
                     <div className="text-gray-300 text-sm font-medium">Active Users</div>
                     <div className="text-green-400 text-xs mt-1">+127% growth</div>
                   </div>
                   <div className="group p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">$12M+</div>
                     <div className="text-gray-300 text-sm font-medium">Revenue Generated</div>
                     <div className="text-green-400 text-xs mt-1">This quarter</div>
                   </div>
                   <div className="group p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">4.9★</div>
                     <div className="text-gray-300 text-sm font-medium">User Rating</div>
                     <div className="text-yellow-400 text-xs mt-1">2,000+ reviews</div>
                   </div>
                 </div>


              </div>
            </div>
          </div>
          

        </div>
      </div>
    </section>
  );
}