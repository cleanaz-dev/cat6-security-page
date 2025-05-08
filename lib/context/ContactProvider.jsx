"use client"

import { createContext, useMemo, useState, useContext } from "react"
import { PhoneCall, DollarSign, ClipboardList, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Info } from "lucide-react";
import Link from "next/link";

const ContactContext = createContext()

export default function ContactProvider({ data, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activities, setActivities] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);



  
    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM d, yyyy');
    };
  




    function formatNote(noteBody) {
      if (!noteBody) return noteBody;
    
      // Check if the note starts with "Quote created total:"
      if (noteBody.startsWith("Quote")) {
        // Extract UUID and capture the entire () wrapper
        const idRegex = /\((ID:)?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)/i;
        const [fullMatch, idPrefix, quoteId] = noteBody.match(idRegex) || [];
    
        // 2. Find "View Quote" position
        const linkText = "View Quote";
        const linkIndex = noteBody.indexOf(linkText);
    
        if (linkIndex !== -1) {
          return (
            <>
              {/* Text before link (remove parentheses and ID) */}
              {fullMatch 
                ? noteBody.substring(0, linkIndex).replace(fullMatch, '').trim()
                : noteBody.substring(0, linkIndex)
              }
              
              {/* Interactive Link */}
              {quoteId ? (
                <Link 
                  href={`/quotes/${quoteId}`}
                  className="text-blue-600 hover:underline ml-1 font-medium"
                >
                  {linkText}
                </Link>
              ) : (
                <span className="text-gray-400 ml-1">
                  {linkText}
                </span>
              )}
    
              {/* Text after link (remove parentheses and ID) */}
              {fullMatch
                ? noteBody.substring(linkIndex + linkText.length).replace(fullMatch, '').trim()
                : noteBody.substring(linkIndex + linkText.length)
              }
            </>
          );
        }
      }
    
      // Fallback: If no specific format is matched, just return the original body
      return noteBody;
    }
    
    const getIcon = (activity) => {
      if (activity.hs_call_body) return <PhoneCall className="w-4 h-4 text-primary mt-0.5" />;
      if (activity.amount) return <DollarSign className="w-4 h-4 text-green-600  mt-0.5" />;
      if (activity.hs_email_subject) return <Mail className="w-4 h-4 text-primary  mt-0.5" />;
      if (activity.hs_note_body) return <Info className="w-4 h-4 text-warning mt-0.5" />
      return <ClipboardList className="w-4 h-4 text-muted-foreground  mt-0.5" />;
    };


    const renderActivityLog = (activity) => {
      const isCall = 'hs_call_body' in activity;
      const isDeal = 'dealname' in activity;
      const isEmail = 'hs_email_subject' in activity;
      const isNote = 'hs_note_body' in activity;
      const isGeneric = !isCall && !isDeal && !isEmail && !isNote
      
    
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
                  {isNote && "Note"}
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

              {isNote && (
                <>
                 <p className="text-xs md:text-sm text-muted-foreground">
                    {formatNote(activity.hs_note_body)}
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

    const handleAddNewContact = async (formData) => {
      setLoading(true);
      try {
        const response = await fetch('/api/contacts/create-contact', {
          method: 'POST', // String literal
          headers: {
            'Content-Type': 'application/json', // Important for JSON data
          },
          body: JSON.stringify(formData) // Properly stringify the object
        });
    
        const result = await response.json();
    
        if (!response.ok || !result.success) { // Check both response status and result.success
          throw new Error(result.message || "Failed to create contact");
        }
    
        return { data: result, message: "Contact created successfully" };
      } catch (error) {
        console.error("Contact creation error:", error);
        return { error: true, message: error.message || "An unknown error occurred" };
      } finally {
        setLoading(false);
      }
    };
    

    const value = useMemo(() => ({
      handleAddNewContact,
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
    }), [data, loading, error, activities, updatedAt, setUpdatedAt, handleRefresh, handleAddNewContact]);

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
