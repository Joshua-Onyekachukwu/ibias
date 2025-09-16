"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Users, 
  BarChart3, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

const features = [
  {
    title: "Zero-Code AI Analytics",
    description: "Deploy enterprise-grade BI in minutes with drag-and-drop simplicity.",
    icon: Brain,
    color: "from-blue-500 to-blue-600",
    stats: "95% faster setup",
    benefits: ["No SQL needed", "Pre-built templates", "Auto-generated insights"]
  },
  {
    title: "Instant Integrations",
    description: "Connect 50+ platforms with one click. Real-time sync, zero downtime.",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    stats: "50+ connectors",
    benefits: ["Shopify, Stripe", "Google Analytics", "API support"]
  },
  {
    title: "AI Growth Engine",
    description: "Get prioritized recommendations with impact forecasting.",
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600",
    stats: "89% avg growth",
    benefits: ["ROI predictions", "Action roadmaps", "Benchmarking"]
  },
  {
    title: "Team Intelligence",
    description: "Turn insights into action with collaborative workflows.",
    icon: Users,
    color: "from-blue-400 to-blue-500",
    stats: "3x faster execution",
    benefits: ["Task assignments", "Progress tracking", "Role-based views"]
  },
  {
    title: "Market Benchmarking",
    description: "Compare performance against 10K+ anonymized peers.",
    icon: BarChart3,
    color: "from-purple-500 to-blue-500",
    stats: "Industry insights",
    benefits: ["Competitive analysis", "Trend detection", "KPI comparison"]
  },
  {
    title: "Self-Learning AI",
    description: "Algorithms improve continuously based on your feedback.",
    icon: RefreshCw,
    color: "from-teal-400 to-blue-500",
    stats: "Accuracy++",
    benefits: ["Personalization", "Adaptive models", "Anomaly detection"]
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardClasses = useMemo(() => 
    "h-full border border-white/20 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-white/10 transition-all duration-300 hover:border-blue-400/50 hover:-translate-y-2 group cursor-pointer relative",
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href="/auth?mode=signup" className="block h-full">
        <Card className={cardClasses}>
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${feature.color} h-2 w-full`}></div>
        
        <CardHeader className="pb-3">
          {/* Icon with Gradient Background */}
          <div className="mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Title & Stats */}
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-2xl font-bold text-white font-sans leading-tight group-hover:text-blue-400 transition-colors">
              {feature.title}
            </CardTitle>
            <span className="text-xs font-medium px-2 py-1 bg-white/10 text-blue-300 rounded-full border border-white/20">
              {feature.stats}
            </span>
          </div>
          
          <CardDescription className="text-base text-gray-300 mt-3 font-sans leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Benefits List */}
          <ul className="space-y-3 mb-6">
            {feature.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-sans">
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
          
          {/* Enhanced Hover CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 10 
            }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 cursor-pointer font-sans bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-400/30">
              <Sparkles className="w-4 h-4" />
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        </CardContent>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300/50 rounded-lg pointer-events-none transition-all duration-300"></div>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-lg"></div>
        </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function Features() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleIntersection = useCallback(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    handleIntersection();
  }, [handleIntersection]);

  return (
    <section 
      id="features"
      ref={ref}
      className="relative py-24 bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-3">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-300 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Lightbulb className="w-4 h-4" />
            <span>AI-DRIVEN INTELLIGENCE</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-sans leading-tight tracking-tight">
             <span className="block">Enterprise-Grade Insights</span>
             <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
               Without the Complexity
             </span>
           </h2>
           
           <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed">
             IBIAS delivers actionable business intelligence powered by AI — 
             no PhD required.
           </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        

      </div>
    </section>
  );
}