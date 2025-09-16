import { useState } from "react";
import { FlyToInterpolator } from "deck.gl";
import Map3D from "./components/Map3D";
import Timeline from "./components/Timeline";
import eventsData from "./events.json";
import type { Event } from "./types";
import Header from "./components/Header";

function App() {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showReferences, setShowReferences] = useState(false);
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

  const handleMapEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleUnpinEvent = () => {
    setSelectedEvent(null);
  };

  const handleViewStateChange = ({ viewState }: any) => {
    setViewState(viewState);
  };

  const openEventHandler = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header pinnedEvent={selectedEvent} onUnpin={handleUnpinEvent} />

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
        onEventClick={handleTimelineEventClick}
        onEventHover={handleEventHover}
        openEventHandler={openEventHandler}
        selectedEvent={selectedEvent}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* References Floating Button */}
      <button
        onClick={() => setShowReferences(true)}
        className="fixed top-8 right-8 z-20 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-300/40"
      >
        Referencias
      </button>

      {/* References Modal */}
      {showReferences && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReferences(false);
          }}
        >
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Referencias y Lecturas
              </h2>
              <button
                onClick={() => setShowReferences(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Lecturas
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>
                    Dailey, J. (2018). Building the American Republic, Vol. 2: A
                    Narrative History from 1877. University of Chicago Press
                    (pp. 1–73).
                  </li>
                  <li>
                    Watson, H. (2018). Building the American Republic, Vol. 1: A
                    Narrative History to 1877. University of Chicago Press.
                  </li>
                  <li>
                    HistoriaUniversal.org (2023). La reconstrucción de los
                    Estados Unidos: Los Estados Unidos en la posguerra.
                  </li>
                  <li>
                    Aprende Historia (2023). La Revolución Industrial en EE.
                    UU.: Impacto y Consecuencias.
                  </li>
                  <li>
                    LibreTexts (Español). 19.4: Theodore Roosevelt y el
                    imperialismo estadounidense.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Fuentes de Eventos
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  {Array.isArray(eventsData) &&
                    Array.from(
                      new Set(
                        eventsData
                          .flatMap((e: any) => e.sources ?? [])
                          .filter(Boolean)
                          .map((s: any) => JSON.stringify(s))
                      )
                    )
                      .map((s: any) => JSON.parse(s))
                      .map((s: any, idx: number) => (
                        <li key={idx}>
                          {s.author ? `${s.author}. ` : ""}
                          {s.title}
                          {s.year ? ` (${s.year})` : ""}
                          {s.url ? ` — ${s.url}` : ""}
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
