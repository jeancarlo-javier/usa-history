import { useState } from "react";
import Map3D from "./components/Map3D";
import Timeline from "./components/Timeline";
import EventModal from "./components/EventModal";
import eventsData from "./events.json";

interface Event {
  id: number;
  title: string;
  year: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  modernConnection: string;
  significance: number;
}

function App() {
  const minYear = Math.min(...eventsData.map(e => e.year));
  const maxYear = Math.max(...eventsData.map(e => e.year));

  const [selectedYear, setSelectedYear] = useState<number>(minYear);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Title Overlay */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm text-white px-8 py-4 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-2">
            Industrialization and Economic Transformation
          </h1>
          <p className="text-lg text-gray-300">
            United States History: 1877-1914
          </p>
        </div>
      </div>

      {/* 3D Map Background */}
      <Map3D
        selectedYear={selectedYear}
        onEventClick={handleEventClick}
      />

      {/* Timeline Component */}
      <Timeline
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
