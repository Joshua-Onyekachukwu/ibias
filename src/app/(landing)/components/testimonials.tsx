"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  Star, 
  Quote, 
  ArrowLeft, 
  ArrowRight, 
  Users,
  Building2,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "IBIAS transformed how we understand our business. The AI recommendations helped us increase our conversion rate by 23% in just two months. It's like having a data scientist on our team 24/7.",
    author: "Sarah Johnson",
    role: "E-commerce Director",
    company: "StyleHaven",
    avatar: "SJ",
    rating: 5,
    industry: "E-commerce",
    results: "+23% Conversion Rate",
    timeframe: "2 months",
    companySize: "50-100 employees",
    featured: true
  },
  {
    quote: "As a small business owner, I don't have time for complex analytics. IBIAS makes it simple to understand what's working and what needs attention. The ROI has been incredible.",
    author: "Michael Chen",
    role: "Founder & CEO",
    company: "TechGadgets",
    avatar: "MC",
    rating: 5,
    industry: "Technology",
    results: "300% ROI",
    timeframe: "3 months",
    companySize: "10-50 employees",
    featured: false
  },
  {
    quote: "The peer benchmarking feature alone is worth the investment. We discovered we were underperforming in email marketing and fixed it immediately. Revenue increased by 45%.",
    author: "Jessica Williams",
    role: "Marketing Manager",
    company: "Wellness Collective",
    avatar: "JW",
    rating: 5,
    industry: "Health & Wellness",
    results: "+45% Revenue",
    timeframe: "6 weeks",
    companySize: "20-50 employees",
    featured: false
  },
  {
    quote: "IBIAS helped us identify a critical bottleneck in our sales funnel that we never would have found otherwise. The AI insights are incredibly accurate and actionable.",
    author: "David Rodriguez",
    role: "Sales Director",
    company: "CloudTech Solutions",
    avatar: "DR",
    rating: 5,
    industry: "SaaS",
    results: "+67% Sales Efficiency",
    timeframe: "1 month",
    companySize: "100+ employees",
    featured: true
  },
  {
    quote: "The real-time alerts saved us from a potential crisis. IBIAS detected unusual patterns in our customer behavior and helped us respond immediately.",
    author: "Emily Foster",
    role: "Operations Manager",
    company: "RetailMax",
    avatar: "EF",
    rating: 5,
    industry: "Retail",
    results: "Crisis Prevented",
    timeframe: "Real-time",
    companySize: "200+ employees",
    featured: false
  },
  {
    quote: "Implementation was seamless and the support team is outstanding. Within days, we were getting insights that transformed our decision-making process.",
    author: "Robert Kim",
    role: "CTO",
    company: "FinanceFlow",
    avatar: "RK",
    rating: 5,
    industry: "Finance",
    results: "Faster Decisions",
    timeframe: "1 week",
    companySize: "50-100 employees",
    featured: false
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  const cardClasses = useMemo(() => {
    return "bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 h-full group";
  }, []);

  return (
    <Card className={cardClasses}>
      <CardContent className="p-8 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-6 relative z-10">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        {/* Quote */}
        <blockquote className="text-gray-300 text-lg leading-relaxed mb-8 font-medium relative z-10">
          "{testimonial.quote}"
        </blockquote>
        
        {/* Results Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold mb-8 relative z-10">
          <CheckCircle className="w-4 h-4" />
          {testimonial.results}
        </div>
        
        {/* Author Info */}
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
            {testimonial.avatar}
          </div>
          <div className="flex-1">
            <div className="font-bold text-white text-lg mb-1">
              {testimonial.author}
            </div>
            <div className="text-blue-400 font-medium mb-2">
              {testimonial.role}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{testimonial.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{testimonial.companySize}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  }, []);
  
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3));
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
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
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(nextSlide, 8000);
    
    return () => clearInterval(interval);
  }, [isVisible, nextSlide]);
  
  const visibleTestimonials = testimonials.slice(currentIndex * 3, (currentIndex * 3) + 3);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gray-950 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <Quote className="w-4 h-4" />
              Customer Stories
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">10,000+</span> Businesses
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how businesses like yours are transforming with IBIAS AI-powered insights
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">4.9/5</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">156%</div>
              <div className="text-gray-400">Avg Growth Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">10,000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-gray-400">AI Monitoring</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {visibleTestimonials.map((testimonial, index) => (
                <div key={`${currentIndex}-${index}`} className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="lg"
                onClick={prevSlide}
                className="border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm bg-gray-900/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={nextSlide}
                className="border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm bg-gray-900/50"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}