"use client"

import { createContext, useContext, useMemo, useState } from 'react'

const QuoteContext = createContext(null)

export function QuoteProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const handleSend = async (quoteId, contactData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/test/stripe/send-quote-to-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quoteId,
          contact: {
            email: contactData.email,
            firstname: contactData.firstname,
            hs_object_id: contactData.hs_object_id
          }
        })
      })

      if (!response.ok) throw new Error('Failed to send quote')
      
      const { quoteUrl } = await response.json()
      window.open(quoteUrl, '_blank') // Open Stripe quote in new tab

    } catch (err) {
      setError(err.message)
      console.error('Quote sending failed:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const value = useMemo(() => ({
    handleSend,
    loading,
    error,
    ...data
  }), [data, loading, error, handleSend])
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}