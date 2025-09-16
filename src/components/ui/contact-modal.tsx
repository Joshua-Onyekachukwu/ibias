'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, Calendar, User, Building, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'contact' | 'demo' | 'sales'
}

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  inquiryType: string
  message: string
}

export default function ContactModal({ isOpen, onClose, type = 'contact' }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const getModalTitle = () => {
    switch (type) {
      case 'demo':
        return 'Schedule a Demo'
      case 'sales':
        return 'Contact Sales'
      default:
        return 'Contact Us'
    }
  }

  const getModalDescription = () => {
    switch (type) {
      case 'demo':
        return 'See IBIAS in action with a personalized demo tailored to your business needs.'
      case 'sales':
        return 'Get in touch with our sales team to discuss pricing and enterprise solutions.'
      default:
        return 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'
    }
  }

  const getInquiryOptions = () => {
    switch (type) {
      case 'demo':
        return [
          'Product Demo',
          'Technical Integration',
          'Custom Solutions',
          'Enterprise Features'
        ]
      case 'sales':
        return [
          'Pricing Information',
          'Enterprise Solutions',
          'Volume Discounts',
          'Partnership Opportunities'
        ]
      default:
        return [
          'General Inquiry',
          'Technical Support',
          'Billing Question',
          'Feature Request',
          'Partnership',
          'Other'
        ]
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        inquiryType: '',
        message: ''
      })
      onClose()
    }, 3000)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block w-full max-w-2xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {getModalTitle()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getModalDescription()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Thank you for reaching out!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've received your message and will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">
                        Company
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="pl-10"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Inquiry Type *
                    </Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange('inquiryType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getInquiryOptions().map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                      Message *
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="pl-10 min-h-[120px] resize-none"
                        placeholder={type === 'demo' ? 'Tell us about your use case and what you\'d like to see in the demo...' : type === 'sales' ? 'Tell us about your requirements and how we can help...' : 'How can we help you?'}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {type === 'demo' ? 'Schedule Demo' : type === 'sales' ? 'Contact Sales' : 'Send Message'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}