"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  Database, 
  Brain, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  BarChart3, 
  Users, 
  Clock,
  Sparkles,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Connect Your Data Sources",
    description: "Easily integrate with your existing business tools like Shopify, WooCommerce, Google Analytics, and more with just a few clicks.",
    icon: Database,
    color: "from-ibias-blue-500 to-ibias-blue-600",
    bgColor: "bg-white",
    borderColor: "border-ibias-blue-200",
    features: ["50+ Integrations", "Real-time Sync", "Secure Connection"],
    time: "2 minutes",
    visual: "🔗"
  },
  {
    number: "02",
    title: "AI Analyzes Your Business",
    description: "Our AI engine processes your data to identify patterns, anomalies, and opportunities that human analysis might miss.",
    icon: Brain,
    color: "from-ibias-accent-500 to-ibias-accent-600",
    bgColor: "bg-white",
    borderColor: "border-ibias-accent-200",
    features: ["Pattern Recognition", "Anomaly Detection", "Predictive Analytics"],
    time: "Real-time",
    visual: "🧠"
  },
  {
    number: "03",
    title: "Get Actionable Recommendations",
    description: "Receive prioritized, specific recommendations tailored to your business goals and current performance metrics.",
    icon: Target,
    color: "from-ibias-blue-500 to-ibias-blue-600",
    bgColor: "bg-white",
    borderColor: "border-ibias-blue-200",
    features: ["Prioritized Actions", "ROI Predictions", "Custom Goals"],
    time: "Instant",
    visual: "🎯"
  },
  {
    number: "04",
    title: "Implement and Track Results",
    description: "Assign tasks to your team, implement changes, and track the impact of each recommendation over time.",
    icon: TrendingUp,
    color: "from-ibias-accent-500 to-ibias-accent-600",
    bgColor: "bg-white",
    borderColor: "border-ibias-accent-200",
    features: ["Team Collaboration", "Progress Tracking", "Impact Measurement"],
    time: "Ongoing",
    visual: "📈"
  },
];

const StepCard = ({ step, index, isActive, onClick }: { 
  step: typeof steps[0], 
  index: number, 
  isActive: boolean, 
  onClick: () => void 
}) => {
  const Icon = step.icon;
  
  const cardClasses = useMemo(() => {
    return `group relative cursor-pointer transition-all duration-500 transform ${
      isActive ? 'scale-105 z-20' : 'hover:scale-102 hover:z-10'
    }`;
  }, [isActive]);
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
    >
      <div className={`relative p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 backdrop-blur-sm min-h-[420px] flex flex-col ${
        isActive 
          ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-400/60 shadow-2xl shadow-blue-500/30' 
          : 'bg-gradient-to-br from-slate-900/60 to-blue-900/30 border-white/20 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/25'
      }`}>
        
        {/* Animated Background */}
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-10 rounded-2xl`} />
        )}
        
        {/* Subtle Inner Glow */}
        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        } bg-gradient-to-r from-blue-500/5 to-indigo-500/5`} />
        
        {/* Step Number Badge */}
        <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 border-2 border-white/20 ${
          isActive ? 'scale-110 shadow-2xl' : 'group-hover:scale-105 group-hover:shadow-xl'
        }`}>
          {step.number}
        </div>
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} p-4 mb-6 transition-transform duration-200 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}>
          <Icon className="w-full h-full text-white" />
        </div>
        
        {/* Content */}
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`text-lg sm:text-xl font-bold transition-colors duration-500 leading-tight ${
              isActive ? 'text-white' : 'text-gray-100 group-hover:text-white'
            }`}>
              {step.title}
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 shrink-0 ${
              isActive ? `bg-gradient-to-r ${step.color} text-white shadow-lg` : 'bg-white/15 text-gray-200 group-hover:bg-white/25 group-hover:text-white'
            }`}>
              <Clock className="w-3 h-3" />
              {step.time}
            </div>
          </div>
          
          <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 flex-1 ${
            isActive ? 'text-gray-100' : 'text-gray-200 group-hover:text-gray-100'
          }`}>
            {step.description}
          </p>
          
          {/* Features */}
          <div className="space-y-3 mt-auto">
            {step.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className={`w-4 h-4 transition-all duration-500 ${
                  isActive ? 'text-green-400 scale-110' : 'text-gray-300 group-hover:text-green-400 group-hover:scale-105'
                }`} />
                <span className={`text-sm transition-colors duration-500 ${
                  isActive ? 'text-gray-100 font-medium' : 'text-gray-200 group-hover:text-gray-100 group-hover:font-medium'
                }`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Arrow indicator for active step */}
        {isActive && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
  
  const rotateStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(rotateStep, 4000);
    return () => clearInterval(interval);
  }, [isVisible, rotateStep]);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="relative py-32 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20stroke-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%2030h60M30%200v60%22/%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        
        {/* Floating Orbs with Enhanced Animation */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        
        {/* Simplified Particles - Reduced for performance */}
        {isVisible && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => {
              const positions = [
                { left: 15, top: 20, delay: 0.5 },
                { left: 85, top: 30, delay: 1.0 },
                { left: 25, top: 70, delay: 1.5 },
                { left: 75, top: 80, delay: 2.0 },
                { left: 45, top: 15, delay: 2.5 },
                { left: 65, top: 60, delay: 3.0 },
                { left: 35, top: 85, delay: 3.5 },
                { left: 55, top: 40, delay: 4.0 }
              ];
              const pos = positions[i];
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    animationDelay: `${pos.delay}s`,
                    animationDuration: '3s'
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      
      <div className="relative container mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-ibias-accent-400" />
              <span className="text-ibias-accent-300 text-sm font-medium">Simple 4-Step Process</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              How IBIAS <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">Transforms</span> Your Business
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From data chaos to actionable insights in minutes. Our AI-powered platform makes business intelligence accessible to everyone.
            </p>
          </div>

          {/* Enhanced Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12 max-w-6xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <StepCard 
                  step={step} 
                  index={index} 
                  isActive={activeStep === index}
                  onClick={() => setActiveStep(index)}
                />
              </div>
            ))}
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mb-12">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep 
                    ? 'bg-ibias-accent-400 w-8' 
                    : index < activeStep 
                    ? 'bg-white w-6' 
                    : 'bg-white/20'
                }`}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
          

        </div>
      </div>
    </section>
  );
}