import React from 'react';

interface Event {
  id: number;
  title: string;
  year: number;
}

interface TimelineProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function Timeline({ events, onEventClick }: TimelineProps) {
  const handleEventClick = (event: Event) => {
    onEventClick(event);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm text-white px-8 py-4 rounded-lg shadow-lg w-full">
      <div className="min-w-full">
        {/* Timeline Container */}
        <div className="relative px-8 py-12">
          {/* Horizontal Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-500 transform -translate-y-1/2 z-10"></div>
          
          {/* Events Container */}
          <div className="flex items-center justify-between relative">
          
            {/* Timeline Events */}
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="relative flex flex-col items-center z-20"
                style={{ 
                  position: 'absolute',
                  left: `${(index / (events.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
              {/* Event Name (floating - alternating top/bottom) */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 text-center ${index % 2 === 0 ? '-top-12' : '-bottom-12'}`}>
                <div className="text-sm font-semibold text-white whitespace-nowrap">
                  {event.title}
                </div>
                <div className="text-xs text-gray-300 whitespace-nowrap">
                  {event.year}
                </div>
              </div>
              
              {/* Timeline Point */}
              <div 
                className={`w-4 h-4 rounded-full border-4 border-black bg-amber-500 shadow-md cursor-pointer transition-all duration-300 hover:w-6 hover:h-6`}
                onClick={() => handleEventClick(event)}
              ></div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}