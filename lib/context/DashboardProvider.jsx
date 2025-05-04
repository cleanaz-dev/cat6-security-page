"use client"

import { createContext, useContext, useMemo, useState } from 'react'

const DashboardContext = createContext(null)

export function DashboardProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatSum = (sum) => {
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const value = useMemo(() => ({
    loading,
    error,
    formatSum,
    // Add your own custom hooks and state here
    ...data,
  }), [data, loading, error, formatSum])

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
  export function useDashboard() {
    const context = useContext(DashboardContext)
    if (!context) {
      throw new Error('useDashboard must be used within a DashboardProvider')
    }
    return context
  }