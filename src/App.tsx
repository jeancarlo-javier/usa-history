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
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openEvent, setOpenEvent] = useState<Event | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 4,
    bearing: 0,
    pitch: 45,
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const minYear = Math.min(...eventsData.map((e) => e.year));
  const maxYear = Math.max(...eventsData.map((e) => e.year));

  const handleEventHover = (event: Event | null) => {
    if (event) {
      setHoveredEvent(event);
      if (!selectedEvent) {
        setViewState((prev) => ({
          ...prev,
          longitude: event.longitude,
          latitude: event.latitude,
          zoom: 6,
          transitionDuration: 500,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      }
    } else {
      setHoveredEvent(null);
      if (!selectedEvent) {
        setViewState((prev) => ({
          ...prev,
          longitude: -95.7129,
          latitude: 37.0902,
          zoom: 4,
          transitionDuration: 500,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      }
    }
  };

  const handleTimelineEventClick = (event: Event) => {
    if (selectedEvent && selectedEvent.id === event.id) {
      setSelectedEvent(null);
      setViewState((prev) => ({
        ...prev,
        longitude: -95.7129,
        latitude: 37.0902,
        zoom: 4,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    } else {
      setSelectedEvent(event);
      setViewState((prev) => ({
        ...prev,
        longitude: event.longitude,
        latitude: event.latitude,
        zoom: 6,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  };

  const openEventHandler = (event: Event) => {
    setOpenEvent(event);
  };

  const handleMapEventClick = (event: Event) => {
    openEventHandler(event);
  };

  const handleCloseModal = () => {
    setOpenEvent(null);
  };

  const handleViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Title Overlay */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-amber-900/80 backdrop-blur-sm rounded-lg px-8 py-4 border border-amber-600/30 text-center shadow-2xl">
          <h1 className="text-4xl font-bold text-amber-100 mb-2">
            Industrialization and Economic Transformation
          </h1>
          <p className="text-lg text-amber-300">
            United States History: 1877-1914
          </p>
        </div>
      </div>

      {/* 3D Map Background */}
      <Map3D
        onEventClick={handleMapEventClick}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        selectedEvent={selectedEvent}
        hoveredEvent={hoveredEvent}
      />

      {/* Timeline Component */}
      <Timeline
        events={eventsData}
        onEventClick={handleTimelineEventClick}
        onEventHover={handleEventHover}
        selectedEvent={selectedEvent}
        openEventHandler={openEventHandler}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* Event Details Modal */}
      <EventModal event={openEvent} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
