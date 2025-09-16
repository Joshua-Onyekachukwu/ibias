"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Zap, Crown, Rocket, Star, TrendingUp, Shield, Users } from "lucide-react";
import ContactModal from '@/components/ui/contact-modal';

const plans = [
  {
    name: "Starter",
    description: "Perfect for solo entrepreneurs and new businesses getting started.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    billing: "forever free",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    savings: "Free Forever",
    features: [
      { text: "Connect up to 2 data sources", highlight: false },
      { text: "5 AI insights per month", highlight: true },
      { text: "3 months data retention", highlight: false },
      { text: "Basic weekly reports", highlight: false },
      { text: "Community support", highlight: false },
      { text: "Mobile-responsive panel", highlight: true },
    ],
    benefits: [
      "Get started with zero cost",
      "Validate your business model",
      "Professional analytics basics"
    ],
    cta: "Get Started Free",
    href: "/auth?mode=signup&plan=starter",
    popular: false,
    testimonial: "IBIAS Free helped us understand our customers without any upfront cost!",
    author: "Sarah Chen, Founder"
  },
  {
    name: "Growth",
    description: "Ideal for growing businesses ready to scale with data-driven decisions.",
    monthlyPrice: 59,
    yearlyPrice: 47,
    billing: "per month",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    savings: "20% off",
    features: [
      { text: "Connect up to 10 data sources", highlight: false },
      { text: "Unlimited AI insights & alerts", highlight: true },
      { text: "Predictive analytics & forecasting", highlight: true },
      { text: "12 months data retention", highlight: false },
      { text: "API access & webhooks", highlight: true },
      { text: "Team collaboration (5 users)", highlight: false },
      { text: "Custom panels", highlight: true },
      { text: "White-label reports", highlight: true },
      { text: "Priority support", highlight: false },
    ],
    benefits: [
      "3-5x ROI within 90 days",
      "Save 10-20 hours monthly",
      "Optimize marketing spend"
    ],
    cta: "Start Free Trial",
    href: "/auth?mode=signup&plan=growth",
    popular: true,
    testimonial: "Growth plan delivered 300% ROI in 3 months through optimized campaigns.",
    author: "Michael Rodriguez, CMO"
  },
  {
    name: "Scale",
    description: "For scaling companies with complex analytics and automation needs.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    billing: "per month",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    savings: "20% off",
    features: [
      { text: "Unlimited data sources", highlight: true },
      { text: "Custom AI models & training", highlight: true },
      { text: "Advanced forecasting & CLV", highlight: true },
      { text: "24 months data retention", highlight: false },
      { text: "Workflow automation", highlight: true },
      { text: "Team collaboration (25 users)", highlight: false },
      { text: "SSO & advanced permissions", highlight: true },
      { text: "24/7 priority support", highlight: false },
      { text: "Dedicated success manager", highlight: true },
      { text: "SOC 2 & GDPR compliance", highlight: true },
    ],
    benefits: [
      "5-10x ROI through AI automation",
      "Save 20+ hours weekly",
      "Enterprise-grade security"
    ],
    cta: "Start Free Trial",
    href: "/auth?mode=signup&plan=scale",
    popular: false,
    testimonial: "Scale plan's AI automation transformed our entire business intelligence.",
    author: "David Kim, CTO"
  },
];

interface PricingCardProps {
  plan: typeof plans[0];
  isYearly: boolean;
  index: number;
  openContactModal: (type: 'contact' | 'demo' | 'sales') => void;
}

function PricingCard({ plan, isYearly, index, openContactModal }: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const IconComponent = plan.icon;
  
  const currentPrice = useMemo(() => isYearly ? plan.yearlyPrice : plan.monthlyPrice, [isYearly, plan.yearlyPrice, plan.monthlyPrice]);
  const originalPrice = useMemo(() => isYearly ? plan.monthlyPrice : null, [isYearly, plan.monthlyPrice]);

  const handleTestimonialTimer = useCallback(() => {
    const timer = setTimeout(() => {
      setShowTestimonial(true);
    }, 1500 + index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    return handleTestimonialTimer();
  }, [handleTestimonialTimer]);

  return (
    <div className="relative h-full">

      
      <div
          className={`relative group transform transition-all duration-700 hover:scale-105 h-full ${
            plan.popular ? 'z-20 mt-8' : 'z-10'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animationDelay: `${index * 200}ms`,
        }}
      >
        <Card
          className={`relative overflow-hidden h-full flex flex-col transition-all duration-500 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl ${
            plan.popular
              ? 'border-blue-400/40 shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 hover:shadow-blue-500/30 hover:border-blue-400/60'
              : 'hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5'
          } ${isHovered ? 'shadow-2xl transform-gpu' : 'shadow-lg'}`}
        >

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 opacity-15">
          <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-8`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)]" />
        </div>
        
        {/* Animated Border */}
        {isHovered && (
          <div className="absolute inset-0 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-cyan-500/15 rounded-lg" />
          </div>
        )}
        




        {/* Enhanced Savings Badge */}
        {isYearly && plan.monthlyPrice > 0 && (
          <div className="absolute top-6 right-6 z-20">
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-black border border-green-300 px-3 py-1 text-xs font-bold shadow-lg backdrop-blur-sm">
              💰 {plan.savings}
            </Badge>
          </div>
        )}

        <CardHeader className="relative z-10 pt-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${plan.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              {plan.name}
              {plan.popular && <Crown className="w-5 h-5 text-amber-400" />}
            </CardTitle>
          </div>
          <CardDescription className="text-base text-gray-300">{plan.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 relative z-10">
          {/* Pricing */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-white">
                {currentPrice === 0 ? 'FREE' : `$${currentPrice}`}
              </span>
              {originalPrice && isYearly && currentPrice > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice}
                </span>
              )}
              <span className="text-gray-400">{plan.billing}</span>
            </div>
            {isYearly && currentPrice > 0 && (
              <p className="text-sm text-green-300 font-medium mt-1">
                Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12} per year
              </p>
            )}
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wide mb-3">
              Key Benefits
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {plan.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-blue-300 uppercase tracking-wide mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Features Included
            </h4>
            <ul className="space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start space-x-3 group">
                  <CheckCircle 
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-200 ${
                      feature.highlight ? 'text-blue-400 group-hover:text-blue-300' : 'text-gray-400 group-hover:text-gray-300'
                    }`} 
                  />
                  <span 
                    className={`text-sm transition-colors duration-200 ${
                      feature.highlight ? 'text-white font-medium group-hover:text-blue-100' : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          {showTestimonial && (
            <div className={`transition-all duration-500 transform ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
            }`}>
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="text-sm italic text-gray-300 mb-2">
                  "{plan.testimonial}"
                </p>
                <p className="text-xs font-medium text-white">
                  — {plan.author}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="relative z-10 mt-auto">
          <Link href={plan.href} className="w-full">
            <Button
              variant={plan.popular ? "default" : "outline"}
              className={`w-full py-3 font-semibold transition-all duration-300 ${
                plan.popular
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl border border-primary/50'
                  : 'bg-background/10 hover:bg-background/20 text-foreground border border-border hover:border-border/70'
              } ${isHovered ? 'transform scale-105' : ''}`}
              onClick={() => {
                if (plan.cta === 'Contact Sales') {
                  openContactModal('sales');
                } else if (plan.cta === 'Schedule Demo') {
                  openContactModal('demo');
                }
              }}
            >
              {plan.cta}
              {plan.monthlyPrice > 0 && (
                <span className="ml-2 text-xs opacity-75">• 14-day free trial</span>
              )}
            </Button>
          </Link>
        </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contactModal, setContactModal] = useState({ isOpen: false, type: 'contact' as 'contact' | 'demo' | 'sales' });

  const openContactModal = (type: 'contact' | 'demo' | 'sales') => {
    setContactModal({ isOpen: true, type });
  };

  const closeContactModal = () => {
    setContactModal({ isOpen: false, type: 'contact' });
  };

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    const element = document.getElementById('pricing');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="pricing" className="py-32 pb-40 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-cyan-500/12 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        
        {/* Interactive cursor glow */}
        <div 
          className="absolute w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none transition-all duration-500"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>
      
      <div className="container-custom relative z-10">
        {/* Enhanced Header */}
        <div className={`text-center space-y-8 mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium text-blue-300 border border-blue-400/30 shadow-lg">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white">14-day free trial • No credit card required • Cancel anytime</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                Simple, Transparent
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mt-2">
                Pricing
              </span>
            </h2>
            
            <div className="flex items-center justify-center space-x-2 text-yellow-400 pt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-white font-medium ml-2">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Choose the plan that fits your business needs. Join <span className="text-blue-400 font-semibold">10,000+ companies</span> already using IBIAS to transform their analytics and accelerate growth.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-2 shadow-2xl border border-slate-200/60 backdrop-blur-sm">
              <div className="flex items-center bg-white/80 rounded-2xl p-1 shadow-inner">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-500 transform ${
                    !isYearly
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl scale-105 shadow-purple-500/25'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/80'
                  }`}
                >
                  <span className="relative z-10">Monthly</span>
                  {!isYearly && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur-sm opacity-60 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-500 transform ${
                    isYearly
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl scale-105 shadow-purple-500/25'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/80'
                  }`}
                >
                  <span className="relative z-10">Yearly</span>
                  {isYearly && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur-sm opacity-60 animate-pulse"></div>
                  )}
                  {isYearly && (
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
                      Save 20%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Pricing Cards */}
        <div className={`grid grid-cols-1 gap-8 lg:grid-cols-3 mb-20 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="relative h-full"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <PricingCard
                plan={plan}
                isYearly={isYearly}
                index={index}
                openContactModal={openContactModal}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center space-y-8 mt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-card/10 rounded-2xl p-8 border border-border backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Need a custom solution?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-lg">
              For enterprises with unique requirements, we offer custom implementations, dedicated support, and tailored integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/50"
                onClick={() => openContactModal('sales')}
              >
                Contact Sales
              </Button>
              <Button 
                size="lg" 
                className="bg-background/10 hover:bg-background/20 text-foreground border border-border hover:border-border/70"
                onClick={() => openContactModal('demo')}
              >
                Schedule Demo
              </Button>
            </div>

          </div>
        </div>
      </div>
      
      <ContactModal 
         isOpen={contactModal.isOpen} 
         onClose={closeContactModal} 
         type={contactModal.type}
       />
    </section>
  );
}