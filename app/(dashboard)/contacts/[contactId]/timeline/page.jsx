// app/contacts/[contactId]/timeline/page.jsx
export default function TimelinePage() {
  const timelineEvents = [
    {
      id: '1',
      type: 'installation',
      status: 'completed',
      date: '2025-05-10T09:00:00',
      title: 'CCTV System Installed',
      description: '4K cameras installed at all entry points (System ID: CCTV-2c3f8f)',
      assignedTo: 'Tech Team A',
      icon: '📹',
      aiAnalyst: "Installation time: 3.2 hours (avg: 4.1 hours)",
      aiStrategist: "Recommend same team for similar commercial setups"
    },
    {
      id: '2',
      type: 'configuration',
      status: 'completed',
      date: '2025-05-10T13:30:00',
      title: 'System Configured',
      description: 'Motion detection zones and alert thresholds set',
      assignedTo: 'Config Team',
      icon: '⚙️',
      aiAnalyst: "Configuration completed 45min faster than average",
      aiStrategist: "Save this profile for similar retail clients"
    },
    {
      id: '3',
      type: 'testing',
      status: 'completed',
      date: '2025-05-11T10:00:00',
      title: 'Quality Testing',
      description: 'All cameras tested at different lighting conditions',
      assignedTo: 'QA Team',
      icon: '🔍',
      aiAnalyst: "Zero defects found (avg: 1.2 per install)",
      aiStrategist: "Expedite remaining testing for Client B"
    },
    {
      id: '4',
      type: 'training',
      status: 'completed',
      date: '2025-05-11T14:00:00',
      title: 'Staff Training',
      description: '4 employees trained on monitoring software',
      assignedTo: 'Training Team',
      icon: '👨‍🏫',
      aiAnalyst: "Training duration: 2.1 hours (client avg: 2.5)",
      aiStrategist: "Schedule refresher in 3 months (retention boost)"
    },
    {
      id: '5',
      type: 'maintenance',
      status: 'completed',
      date: '2025-05-15T11:00:00',
      title: 'First Maintenance',
      description: 'Lens cleaning and software update applied',
      assignedTo: 'Tech Team B',
      icon: '🛠️',
      aiAnalyst: "Maintenance completed in 1.2 hours (scheduled: 2)",
      aiStrategist: "Extend service interval to 8 weeks"
    },
    {
      id: '6',
      type: 'alert',
      status: 'completed',
      date: '2025-05-16T03:15:00',
      title: 'Motion Alert',
      description: 'Back door motion detected and recorded',
      assignedTo: 'Security System',
      icon: '🚨',
      aiAnalyst: "Alert response time: 12sec (threshold: 30sec)",
      aiStrategist: "Adjust sensitivity for delivery hours"
    },
    {
      id: '7',
      type: 'upgrade',
      status: 'scheduled',
      date: '2025-06-20T09:00:00',
      title: 'Storage Upgrade',
      description: 'Scheduled 8TB storage expansion',
      assignedTo: 'Tech Team A',
      icon: '💾',
      aiAnalyst: "Storage 78% utilized (projected full in 22 days)",
      aiStrategist: "Pre-order parts for Client B upgrade"
    },
    {
      id: '8',
      type: 'audit',
      status: 'pending',
      date: '2025-07-01T10:00:00',
      title: 'Quarterly Audit',
      description: 'Full system performance review scheduled',
      assignedTo: 'QA Team',
      icon: '📋',
      aiAnalyst: "Previous audit score: 98/100",
      aiStrategist: "Include thermal camera assessment"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Security System Timeline</h1>
      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative pl-10 pb-8 last:pb-0 group">
            <div className={`absolute left-0 top-1 h-3 w-3 rounded-full border-4 ${
              event.status === 'completed' ? 'border-green-500 bg-white' : 'border-yellow-500 bg-white'
            }`}></div>
            <div className={`p-4 rounded-lg border ${
              event.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200'
            } transition-all hover:shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-lg mr-2">{event.icon}</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span className="inline-block h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                Assigned to: {event.assignedTo}
              </div>
              {(event.aiAnalyst || event.aiStrategist) && (
                <div className="mt-3 space-y-2">
                  {event.aiAnalyst && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <span className="font-medium">🔍 Analyst AI</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-800">{event.aiAnalyst}</p>
                    </div>
                  )}
                  {event.aiStrategist && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <span className="font-medium">🎯 Strategist AI</span>
                      </div>
                      <p className="mt-1 text-sm text-purple-800">{event.aiStrategist}</p>
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