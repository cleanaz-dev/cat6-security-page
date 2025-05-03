"use client"

import { createContext, useMemo, useState, useContext } from "react"
import { PhoneCall, DollarSign, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

const ContactContext = createContext()

export default function ContactProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  
    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM d, yyyy');
    };
  
    const getIcon = (activity) => {
      if (activity.hs_call_body) return <PhoneCall className="w-4 h-4 text-primary mt-1" />;
      if (activity.amount) return <DollarSign className="w-4 h-4 text-green-600 mt-1" />;
      return <ClipboardList className="w-4 h-4 text-muted-foreground mt-1" />;
    };


  const renderActivityLog = (activity) => {
    const isCall = activity.hs_call_body;
    const isDeal = activity.amount;
    const isGeneric = activity.hs_object_id && !isCall && !isDeal;
  
    return (
      <div key={activity.hs_object_id} className="p-3 rounded-lg bg-muted/50 border border-border shadow-sm">
        <div className="flex items-start gap-3">
          {getIcon(activity)}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <strong className="text-sm">
                {isCall && activity.hs_call_title}
                {isDeal && activity.dealname}
                {isGeneric && 'Activity'}
              </strong>
              <span className="text-xs text-muted-foreground">
                {formatDate(activity.hs_createdate || activity.createdate || activity.hs_timestamp)}
              </span>
            </div>
            {isCall && (
              <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-3">
                {activity.hs_call_body}
              </p>
            )}
            {isDeal && (
              <>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Stage: <span className="font-medium">{activity.dealstage}</span>
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Amount: <span className="font-medium text-green-700">${activity.amount}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const value = useMemo(() => ({
    renderActivityLog,
    loading,
    error,
    ...data,

    // other context methods and state here
  }), [data, loading, error, renderActivityLog])

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact() {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider")
  }
  return context
}
