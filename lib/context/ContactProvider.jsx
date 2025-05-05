"use client"

import { createContext, useMemo, useState, useContext } from "react"
import { PhoneCall, DollarSign, ClipboardList, Mail } from 'lucide-react';
import { format } from 'date-fns';

const ContactContext = createContext()

export default function ContactProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activities, setActivities] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);



  
    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM d, yyyy');
    };
  
    const getIcon = (activity) => {
      if (activity.hs_call_body) return <PhoneCall className="w-4 h-4 text-primary mt-0.5" />;
      if (activity.amount) return <DollarSign className="w-4 h-4 text-green-600  mt-0.5" />;
      if (activity.hs_email_subject) return <Mail className="w-4 h-4 text-primary  mt-0.5" />;
      return <ClipboardList className="w-4 h-4 text-muted-foreground  mt-0.5" />;
    };


    const renderActivityLog = (activity) => {
      const isCall = 'hs_call_body' in activity;
      const isDeal = 'dealname' in activity;
      const isEmail = 'hs_email_subject' in activity;
      const isGeneric = !isCall && !isDeal && !isEmail;
    
      const date =
        activity.hs_createdate || activity.createdate || activity.hs_timestamp || '';
    
      return (
        <div key={`activity-${activity.hs_object_id}`} className="p-3 rounded-lg bg-muted/50 border border-border shadow-sm">
          <div className="flex items-start gap-3">
            {getIcon(activity)}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm decoration-1 decoration-accent">
                  {isCall && activity.hs_call_title}
                  {isDeal && activity.dealname}
                  {isEmail && activity.hs_email_subject}
                  {isGeneric && 'Activity'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(date)}
                </span>
              </div>
    
              {isCall && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1 ">
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

              {isEmail && (
                <>
                    <p className="text-xs md:text-sm text-muted-foreground">
                    {activity.hs_email_text}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      );
    };

    const handleRefresh = async (contactEmail, refresh = false) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/test/hubspot/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactEmail, refresh }),
        });
        const data = await response.json();
        setActivities(data.activities);
        setUpdatedAt(data.updatedAt);
      } catch (error) {
        console.error("Failed to refresh activities:", error);
      } finally {
        setLoading(false);
      }
    };
    

    const value = useMemo(() => ({
      renderActivityLog,
      handleRefresh,
      loading,
      error,
      setError,
      setLoading,
      activities,
      updatedAt,
      setActivities,
      setUpdatedAt,
      ...data,
    }), [data, loading, error, activities, updatedAt, setUpdatedAt, handleRefresh]);

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
