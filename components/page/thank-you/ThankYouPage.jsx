'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Phone, Clock, User, Mail, MessageSquare, Hash } from 'lucide-react'

export default function ThankYouPage({ data }) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // Check if we have a valid timeOption
    if (!data?.timeOption) return

    const calculateTimeLeft = () => {
      // Parse the timeOption as a Date object
      const callTime = new Date(data.timeOption)
      const now = new Date()
      const difference = callTime.getTime() - now.getTime()
      
      if (difference > 0) {
        return Math.floor(difference / 1000) // Convert to seconds
      } else {
        setIsExpired(true)
        return 0
      }
    }

    // Calculate initial time left
    const initialTimeLeft = calculateTimeLeft()
    setTimeLeft(initialTimeLeft)

    // If already expired, set the state
    if (initialTimeLeft <= 0) {
      setIsExpired(true)
    }

    // Set up interval to update every second
    const timer = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft()
      setTimeLeft(currentTimeLeft)
      
      if (currentTimeLeft <= 0) {
        setIsExpired(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [data?.timeOption])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatCallTime = (timeString) => {
    try {
      const callTime = new Date(timeString)
      return callTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return 'Invalid time'
    }
  }

  // Check if we should show the countdown timer
  const shouldShowCountdown = data?.timeOption && !isNaN(new Date(data.timeOption).getTime())
  
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thank You, {data?.firstname}! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Your request has been submitted successfully
          </p>
        </div>

        {/* Countdown Timer - Only show if we have a valid timeOption */}
        {shouldShowCountdown && (
          <Card className="mb-6 border-2 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {isExpired ? 'Call In Progress' : 'Call Starting Soon'}
                </h2>
                <p className="text-muted-foreground mb-2">
                  Our Rep will call you at <strong className="text-foreground">{data?.phone}</strong>
                </p>
                <p className="text-muted-foreground mb-4">From <strong className="text-foreground">4372920555</strong></p>
                
                {!isExpired && timeLeft > 0 ? (
                  <div className="bg-primary text-primary-foreground rounded-lg p-4">
                    <div className="text-3xl font-mono font-bold mb-1">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm opacity-90">
                      Time until call (scheduled for {formatCallTime(data.timeOption)})
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 animate-pulse">
                    <div className="text-lg font-semibold mb-1">
                      📞 {isExpired ? 'Calling Now!' : 'Ready to Call!'}
                    </div>
                    <div className="text-sm opacity-90">
                      {isExpired ? 'Please answer your phone' : 'Starting call process'}
                    </div>
                  </div>
                )}

                {/* Show scheduled time */}
                <div className="mt-4 text-sm text-muted-foreground">
                  Scheduled for: {formatCallTime(data.timeOption)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              What Happens Next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Rep Call</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI will call you to quickly discuss your requirements and gather additional details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    We'll analyze your needs and prepare a customized solution
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Follow-up</p>
                  <p className="text-sm text-muted-foreground">
                    A team member will contact you within 24 hours with next steps
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2"
          >
            <span>← Back to Home</span>
          </Button>
         
        </div>
      </div>
    </div>
  )
}