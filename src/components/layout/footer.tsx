'use client'

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  MapPin, 
  Phone,
  Shield,
  Star,
  CheckCircle,
  Zap,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ui/contact-modal";

export default function Footer() {
  const [contactModal, setContactModal] = useState({ isOpen: false, type: 'contact' as 'contact' | 'demo' | 'sales' })

  const openContactModal = (type: 'contact' | 'demo' | 'sales') => {
    setContactModal({ isOpen: true, type })
  }

  const closeContactModal = () => {
    setContactModal({ isOpen: false, type: 'contact' })
  }

  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IB</span>
              </div>
              <span className="text-2xl font-bold text-white">IBIAS</span>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Transform your business with AI-powered analytics. Join 10,000+ companies making data-driven decisions.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">4.9/5 Rating</span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@ibias.ai</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* Product Links */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => openContactModal('contact')}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support & Legal */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup & Contact CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-gray-800">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get the latest insights, tips, and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300">
                Subscribe
              </button>
            </div>
            
            {/* Contact CTA */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-gray-400 mb-4">Have questions? We're here to help!</p>
              <Button
                onClick={() => openContactModal('contact')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} IBIAS. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link 
              href="https://twitter.com/ibias" 
              className="w-10 h-10 bg-gray-900/50 hover:bg-blue-500/20 border border-gray-800 hover:border-blue-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link 
              href="https://linkedin.com/company/ibias" 
              className="w-10 h-10 bg-gray-900/50 hover:bg-blue-500/20 border border-gray-800 hover:border-blue-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com/ibias" 
              className="w-10 h-10 bg-gray-900/50 hover:bg-blue-500/20 border border-gray-800 hover:border-blue-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={contactModal.isOpen}
        onClose={closeContactModal}
        type={contactModal.type}
      />
    </footer>
  );
}