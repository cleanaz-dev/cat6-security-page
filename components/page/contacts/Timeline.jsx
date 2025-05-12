// app/contacts/[contactId]/timeline/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useContact } from "@/lib/context/ContactProvider";
import { MailCheck, Mail, Phone, Handshake, Construction, NotebookPen } from "lucide-react";

export default function TimelinePage({ contact }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/test/hubspot/logs", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          contactEmail: contact.email,
          refresh: true,
        }),
      });
      const data = await response.json(); // You probably want to parse the response
      setActivities(data);
    };

    fetchActivities();
  }, [contact.email]);
  console.log("Activities:", activities);

  const transformActivities = (activityData) => {
    // Handle both direct array and { activities: [...] } formats
    const activities = Array.isArray(activityData)
      ? activityData
      : activityData?.activities || [];

    return activities
      .map((activity) => {
        // Base event structure
        const baseEvent = {
          id: activity.hs_object_id || activity.hs_timestamp,
          type: "activity",
          status: "completed",
          date: activity.hs_timestamp || activity.hs_createdate || activity.createdate,
          title: "Activity",
          description: "",
          icon: "⚙️",
          rawData: activity, // Preserve all original data
        };

        // Email Activity
        if (activity.hs_email_subject) {
          return {
            ...baseEvent,
            type: "email",
            title: activity.hs_email_subject,
            description: activity.hs_email_text || "Email sent",
            icon: <Mail />,
          };
        }

        // Note Activity (Quotes)
        if (activity.hs_note_body) {
          const body = activity.hs_note_body;
          const isQuote = body.startsWith("Quote");
          const isJob = body.startsWith("Job");

          return {
            ...baseEvent,
            type: isQuote ? "quote" : isJob ? "job" : "note",
            title: isQuote
              ? "Quote Updated"
              : isJob
              ? "Job Updated"
              : "Note Added",
            description: body,
            icon: isQuote ? <MailCheck /> : isJob ? <Construction /> : <NotebookPen />,
          };
        }
        // Call Activity
        if (activity.hs_call_title) {
          return {
            ...baseEvent,
            type: "call",
            title: activity.hs_call_title,
            description: activity.hs_call_body || "Call completed",
            icon: <Phone />,
          };
        }

        // Deal Activity
        if (activity.dealname) {
          return {
            ...baseEvent,
            type: "deal",
            title: activity.dealname,
            description: `Stage: ${activity.dealstage} | Amount: $${
              activity.amount || "N/A"
            }`,
            icon: <Handshake />,
          };
        }

        return baseEvent;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };


  const timelineEvents = transformActivities(activities);


  return (
    <div className="max-w-3xl mx-auto p-4">
      <header>
        <h1 className="text-2xl font-bold mb-6">Timeline</h1>
      </header>

      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-border"></div>
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative pl-10 pb-8 last:pb-0 group">
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-1 h-3 w-3 rounded-full border-4 ${
                event.status === "completed"
                  ? "border-primary bg-background"
                  : "border-muted-foreground bg-background"
              }`}
            ></div>

            {/* Event card */}
            <div
              className={`p-4 rounded-lg border ${
                event.status === "completed"
                  ? "bg-primary/10 border-primary/20"
                  : "bg-background border-border"
              } transition-all hover:shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg mr-2">{event.icon}</span>
                  <span className="font-medium text-foreground underline decoration-primary">
                    {event.title}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="mt-2 text-muted-foreground">{event.description}</p>

              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground mr-2"></span>
                Created by: {event.createdBy || "System"}
              </div>

              {/* AI Comments (if added later) */}
              {(event.aiAnalyst || event.aiStrategist) && (
                <div className="mt-3 space-y-2">
                  {event.aiAnalyst && (
                    <div className="p-3 bg-secondary rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <span className="font-medium">🔍 Analyst AI</span>
                      </div>
                      <p className="mt-1 text-sm">{event.aiAnalyst}</p>
                    </div>
                  )}
                  {event.aiStrategist && (
                    <div className="p-3 bg-accent rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-sm text-accent-foreground">
                        <span className="font-medium">🎯 Strategist AI</span>
                      </div>
                      <p className="mt-1 text-sm">{event.aiStrategist}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
