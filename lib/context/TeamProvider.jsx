"use client";

import { createContext, useContext, useState, useMemo } from "react";

const TeamContext = createContext();

export default function TeamProvider({ data, children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const jobTypes = [
    {id: 1, name: "New Install"},
    {id: 2, name: "Repair"}, 
    {id: 3, name: "Site Inspection"}
  ]
  const handleAddInstallation = async (data) => {
    try {
  
      // 3. API call
      const response = await fetch("/api/installs/create-install", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error("Failed to create installation");
      }
  
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Installation creation failed");
      }
  
 
      return { success: true, message: "Install created successfully" };
  
    } catch (error) {
      console.error("Installation error:", error);
 
      throw error;
    }
  };

  const formatName = (fullName) => {
    if (!fullName) return "";
  
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
  
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1][0]?.toUpperCase();
  
    return `${firstName} ${lastInitial}.`;
  };

  const getTechNames = (technicianIds, members) => {
  return technicianIds.map(id => {
    const member = members.find(m => m.id === id);

    return {
      name: formatName(member?.fullName || 'Unknown'),
      imageUrl: member?.imageUrl || '/placeholder.png',
    };
  });
};
  const handleNewTicket = async (data) => {
    try {
      const response = await fetch("/api/team/tickets",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const value = useMemo(() => ({
    jobTypes,
    handleAddInstallation,
    getTechNames,
    handleNewTicket,
    ...data
  }), [data, jobTypes, handleAddInstallation, getTechNames, handleNewTicket])
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
