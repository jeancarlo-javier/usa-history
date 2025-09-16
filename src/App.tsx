import { useState } from "react";
import { FlyToInterpolator } from "deck.gl";
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 4,
    bearing: 0,
    pitch: 45,
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setViewState({
      longitude: event.longitude,
      latitude: event.latitude,
      zoom: 6,
      bearing: 0,
      pitch: 45,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setViewState({
      longitude: -95.7129,
      latitude: 37.0902,
      zoom: 4,
      bearing: 0,
      pitch: 45,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const handleViewStateChange = ({ viewState }) => {
    setViewState(viewState);
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
        onEventClick={handleEventClick}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
      />

      {/* Timeline Component */}
      <Timeline events={eventsData} onEventClick={handleEventClick} />

      {/* Event Details Modal */}
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
