"use client"
import { useState, createContext, useContext, useMemo }from 'react'

const InvoiceContext = createContext()

export default function InvoiceProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const value = useMemo(() => ({
    loading,
    error,
    
    setLoading,
    setError,
    ...data,
    //... add more methods if needed
  }), [data, loading, error, setLoading, setError])
  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoice() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider')
  }
  return context
}
