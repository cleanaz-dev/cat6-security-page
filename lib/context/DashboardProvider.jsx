"use client"

import { createContext, useContext, useMemo, useState } from 'react'

const DashboardContext = createContext(null)

export function DashboardProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const value = useMemo(() => ({
    loading,
    error,
    // Add your own custom hooks and state here
    ...data,
  }), [data, loading, error])

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