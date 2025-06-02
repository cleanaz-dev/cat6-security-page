import React from "react";
import {
  CalendarClock,
  Loader2,
  AlertCircle,
  Calendar,
  HeartPulse,
  Clock,
  Zap,
  Timer,
  Gauge,
  Lightbulb,
  Hourglass,
} from "lucide-react";

export default function AiAnalyst({ aiAnalyst, analyzing }) {
  return (
    <div className=" max-w-6xl mx-auto">
      {/* Loading State */}
      {analyzing && (
        <div className="flex items-center justify-center p-8 text-primary-600">
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          <span className="text-lg">Analyzing timeline...</span>
        </div>
      )}

      {/* Analysis Results */}
      {aiAnalyst && (
        <div className="space-y-8">
          {/* Header Section with Summary and Efficiency Score */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Summary - Takes up 2 columns */}
            <div className="lg:col-span-2 p-6 bg-primary rounded-xl">
              <h1 className="text-2xl font-bold text-background leading-relaxed">
                {aiAnalyst.title}
              </h1>
              <h3 className="text-secondary font-medium">Summary:</h3>
              <p className="text-background mb-4">{aiAnalyst.summary}</p>
              <p className="flex items-center gap-2 text-background">
                <CalendarClock strokeWidth={1.5} className="text-secondary" />
                <span>{aiAnalyst.totalDuration}</span>
              </p>
            </div>

            {/* Efficiency Score - Takes up 1 column */}
            <div className="p-6 bg-primary-50 rounded-xl border border-primary/20">
              <div className="flex justify-center text-center mb-4">
                <h4 className="text-lg font-semibold text-primary-800">
                  Efficiency Score
                </h4>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${aiAnalyst.efficiencyScore}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {aiAnalyst.efficiencyScore}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-primary-600">out of 100</p>
              </div>
            </div>
          </div>

          {/* Timeframe Analysis Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 bg-secondary rounded-xl border border-secondary/50 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium ">Fastest Interval</h4>
              </div>
              <p className="text-2xl font-bold text-primary">
                {aiAnalyst.timeframeAnalysis.fastestInterval}
              </p>
            </div>

            <div className="p-6 bg-secondary rounded-xl border border-secondary/50 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium ">Longest Interval</h4>
              </div>
              <p className="text-2xl font-bold text-primary">
                {aiAnalyst.timeframeAnalysis.longestInterval}
              </p>
            </div>

            <div className="p-6 bg-secondary rounded-xl border border-secondary/50 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium ">Average Interval</h4>
              </div>
              <p className="text-2xl font-bold text-primary">
                {aiAnalyst.timeframeAnalysis.averageInterval}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Key Events */}
            <div className="p-6 border-2 border-primary rounded-xl bg-background shadow-sm">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold ">Key Events</h4>
              </div>
              <div className="space-y-6">
                {aiAnalyst.keyEvents.map((event, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-4 border-primary/30"
                  >
                    <div className="absolute -left-2 top-2 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <span className="flex-block font-semibold text-primary bg-primary/10 px-2 py-1 rounded text-sm">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="font-medium">{event.event}</span>
                      </div>
                      <p className="flex items-center text-sm text-primary-muted">
                        Time elapsed: {event.durationFromPrevious}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="p-6 border-2 border-primary rounded-xl bg-background shadow-sm">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold ">Observations</h4>
              </div>
              <div className="space-y-4">
                {aiAnalyst.notableObservations.map((obs, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex items-center justify-center w-8 h-8 mt-1 mr-4 text-sm font-semibold rounded-full bg-primary text-background group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <p className="leading-relaxed flex-1 pt-1">{obs}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Potential Improvements - Full Width */}
          <div className="bg-primary p-8 rounded-xl text-background shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <HeartPulse className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="text-xl font-bold underline decoration-secondary decoration-2 underline-offset-4">
                Potential Improvements
              </h4>
            </div>
            <p className="text-lg leading-relaxed">
              {aiAnalyst.potentialImprovements}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
