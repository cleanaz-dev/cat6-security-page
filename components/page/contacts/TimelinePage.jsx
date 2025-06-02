// app/contacts/[contactId]/timeline/page.jsx
"use client";
import { useState, useEffect } from "react";
import {
  FileWarning,
  Mail,
  Phone,
  Handshake,
  Construction,
  NotebookPen,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AiAnalyst from "./AiAnalyst";
import Timeline from "./Timeline";

export default function TimelinePage({ contact }) {
  const [activities, setActivities] = useState([]);
  const [aiAnalyst, setAiAnalyst] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/logs", {
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
          date:
            activity.hs_timestamp ||
            activity.hs_createdate ||
            activity.createdate,
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
            icon: isQuote ? (
              <FileWarning />
            ) : isJob ? (
              <Construction />
            ) : (
              <NotebookPen />
            ),
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

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiAnalyst(null); // Clear previous analysis

    try {
      const response = await fetch("/api/ai/analyze-timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activities }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const { analysis } = await response.json();
      setAiAnalyst(analysis); // Store the parsed analysis data
      setActiveTab("analysis");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };
  // if (activities.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader2 className="animate-spin text-primary size-10" />
  //     </div>
  //   );
  // }
  const tabVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <Button onClick={handleAnalyze} disabled={timelineEvents.length === 0 || analyzing}>
          {analyzing ? "Analyzing..." : "Analyze Data"}
        </Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[200px] mb-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!aiAnalyst}>
            AI Insights
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "timeline" ? (
            <motion.div
              key="timeline"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {timelineEvents.length === 0 ? (
                <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                  No Timeline Available Yet...
                </div>
              ) : (
                <Timeline timelineEvents={timelineEvents} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <AiAnalyst aiAnalyst={aiAnalyst} />
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
