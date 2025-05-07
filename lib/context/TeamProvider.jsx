"use client";

import { createContext, useContext, useState, useMemo } from "react";

const TeamContext = createContext();

export default function TeamProvider({ data, children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = useMemo(() => ({
    ...data
  }), [data])
return <TeamContext.Provider value={value}>
  {children}
</TeamContext.Provider>
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider")
  }
  return context
}
