'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Users, Video, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MeetingDetails {
  title: string
  description: string
  date: string
  time: string
  duration: string
  meetingType: 'video' | 'in-person' | 'phone'
  location: string
  attendees: string[]
  sendReminder: boolean
  reminderTime: string
}

export function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [isScheduling, setIsScheduling] = useState(false)
  const [newAttendee, setNewAttendee] = useState('')
  const [details, setDetails] = useState<MeetingDetails>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    meetingType: 'video',
    location: '',
    attendees: [],
    sendReminder: true,
    reminderTime: '15'
  })

  const handleScheduleMeeting = async () => {
    if (!details.title.trim()) {
      toast.error('Please enter a meeting title')
      return
    }

    if (details.attendees.length === 0) {
      toast.error('Please add at least one attendee')
      return
    }

    setIsScheduling(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Meeting scheduled successfully!')
      onClose()
      
      // Reset form
      setDetails({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '60',
        meetingType: 'video',
        location: '',
        attendees: [],
        sendReminder: true,
        reminderTime: '15'
      })
    } catch (error) {
      toast.error('Failed to schedule meeting. Please try again.')
    } finally {
      setIsScheduling(false)
    }
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !details.attendees.includes(newAttendee.trim())) {
      setDetails(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }))
      setNewAttendee('')
    }
  }

  const removeAttendee = (email: string) => {
    setDetails(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== email)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addAttendee()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Schedule Meeting
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up a new meeting with team members
                </p>
              </div>
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

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Meeting Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={details.title}
                onChange={(e) => setDetails(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={details.description}
                onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meeting agenda or description"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={details.date}
                  onChange={(e) => setDetails(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={details.time}
                  onChange={(e) => setDetails(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={details.duration} onValueChange={(value) => setDetails(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <Select value={details.meetingType} onValueChange={(value: 'video' | 'in-person' | 'phone') => setDetails(prev => ({ ...prev, meetingType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="in-person">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      In Person
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Phone Call
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            {details.meetingType !== 'video' && (
              <div className="space-y-2">
                <Label htmlFor="location">
                  {details.meetingType === 'in-person' ? 'Location' : 'Phone Number'}
                </Label>
                <Input
                  id="location"
                  value={details.location}
                  onChange={(e) => setDetails(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={details.meetingType === 'in-person' ? 'Enter meeting location' : 'Enter phone number'}
                  className="w-full"
                />
              </div>
            )}

            {/* Attendees */}
            <div className="space-y-2">
              <Label>Attendees *</Label>
              <div className="flex gap-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter email address"
                  className="flex-1"
                />
                <Button onClick={addAttendee} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {details.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {details.attendees.map((email, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm">
                      <Users className="h-3 w-3" />
                      {email}
                      <button
                        onClick={() => removeAttendee(email)}
                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reminder Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder"
                  checked={details.sendReminder}
                  onCheckedChange={(checked) => setDetails(prev => ({ ...prev, sendReminder: checked as boolean }))}
                />
                <Label htmlFor="reminder">Send reminder</Label>
              </div>
              {details.sendReminder && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="reminderTime">Reminder time</Label>
                  <Select value={details.reminderTime} onValueChange={(value) => setDetails(prev => ({ ...prev, reminderTime: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={isScheduling}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting} disabled={isScheduling}>
              {isScheduling ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scheduling...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ScheduleMeetingModal