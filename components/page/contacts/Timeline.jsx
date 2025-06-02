import React from 'react'

export default function Timeline({timelineEvents}) {
  return (
      <div className="relative">
      <div className="absolute left-5 top-0 h-full w-0.5 bg-border"></div>
      {timelineEvents.map((event) => (
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
                <span className="mr-2">{event.icon}</span>
                <span className="font-medium text-lg text-foreground underline decoration-primary">
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

          
          </div>
        </div>
      ))}
    </div>
  )
}
