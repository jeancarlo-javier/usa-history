import React from 'react';
import eventsData from '../events.json';

interface Event {
  id: number;
  title: string;
  year: number;
  prominent?: boolean;
}

interface TimelineProps {
  onEventClick: (event: Event) => void;
  onEventHover: (event: Event | null) => void;
  selectedEvent: Event | null;
  minYear: number;
  maxYear: number;
}

export default function Timeline({ onEventClick, onEventHover, selectedEvent, minYear, maxYear }: TimelineProps) {
  const handleEventClick = (event: Event) => {
    onEventClick(event);
  };

  // Calculate smart positioning to avoid overlaps
  const getSmartPosition = (event: Event, index: number) => {
    const basePosition = ((event.year - minYear) / (maxYear - minYear)) * 100;
    const minSpacing = 8; // Minimum spacing between points (%)
    
    // Adjust position to maintain minimum spacing
    let adjustedPosition = basePosition;
    
    // Check if we need to adjust based on previous events
    for (let i = 0; i < index; i++) {
      const prevEvent = eventsData[i];
      const prevPosition = ((prevEvent.year - minYear) / (maxYear - minYear)) * 100;
      
      if (Math.abs(adjustedPosition - prevPosition) < minSpacing) {
        adjustedPosition = prevPosition + minSpacing;
      }
    }
    
    return Math.min(adjustedPosition, 95); // Don't go beyond 95%
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent text-white shadow-2xl">
      <div className="px-6 py-8">
        {/* Timeline Container */}
        <div className="relative px-8 py-16">
          {/* Horizontal Timeline Line with gradient */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transform -translate-y-1/2 z-10 shadow-lg"></div>
          
          {/* Year markers */}
          <div className="absolute top-1/2 left-8 right-8 transform -translate-y-1/2 z-5">
            {[minYear, Math.floor((minYear + maxYear) / 2), maxYear].map((year, idx) => (
              <div 
                key={year}
                className="absolute text-xs text-gray-400 -bottom-8"
                style={{ left: `${idx * 50}%`, transform: 'translateX(-50%)' }}
              >
                {year}
              </div>
            ))}
          </div>
          
          {/* Events Container */}
          <div className="relative">
            {/* Timeline Events */}
            {eventsData.map((event, index) => {
              const position = getSmartPosition(event, index);
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={event.id} 
                  className="absolute flex flex-col items-center z-20 group transition-all duration-300"
                  style={{ 
                    left: `${position}%`,
                    transform: 'translate(-50%, -50%)',
                    top: '50%'
                  }}
                  onMouseEnter={() => onEventHover(event)}
                  onMouseLeave={() => onEventHover(null)}
                >
                  {/* Event Name (floating tooltip or permanent) */}
                  {event.prominent ? (
                    <div className={`absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-300 group-hover:scale-105 ${
                      isEven ? '-top-16' : 'top-full mt-4'
                    }`}>
                      {/* Connector line for prominent events */}
                      <div className={`absolute left-1/2 transform -translate-x-1/2 w-px bg-amber-400/50 ${
                        isEven ? 'top-full h-4' : 'top-0 -translate-y-full h-4'
                      }`}></div>
                      
                      <div className="bg-amber-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-600/30">
                        <div className="text-sm font-bold text-amber-100 whitespace-nowrap">
                          {event.title}
                        </div>
                        <div className="text-xs text-amber-300 whitespace-nowrap font-medium">
                          {event.year}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-50">
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-gray-300">{event.year}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
                    </div>
                  )}
                  
                  {/* Timeline Point */}
                  <div className="relative">
                    {/* Glow effect for selected */}
                    {selectedEvent?.id === event.id && (
                      <div className="absolute inset-0 w-6 h-6 bg-red-500/50 rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
                    )}
                    
                    <div 
                      className={`relative w-4 h-4 rounded-full border-2 shadow-lg cursor-pointer transition-all duration-300 group-hover:scale-125 ${
                        selectedEvent?.id === event.id 
                          ? 'border-white bg-red-500 shadow-red-500/50' 
                          : event.prominent 
                            ? 'border-amber-300 bg-amber-500 shadow-amber-500/30 group-hover:bg-amber-400' 
                            : 'border-gray-400 bg-gray-600 shadow-gray-600/30 group-hover:bg-gray-500'
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Inner dot for prominent events */}
                      {event.prominent && (
                        <div className="absolute inset-1 bg-amber-200 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Timeline title */}
        <div className="text-center pb-4">
          <div className="text-sm text-gray-400 font-medium">
            US Industrialization Timeline • {minYear} - {maxYear}
          </div>
        </div>
      </div>
    </div>
  );
}
