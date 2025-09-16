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
  prominent?: boolean;
  tags?: string[];
  sources?: { title: string; author?: string; year?: number; url?: string }[];
}

function App() {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openEvent, setOpenEvent] = useState<Event | null>(null);
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
    setOpenEvent(event);
  };

  const handleCloseModal = () => {
    setOpenEvent(null);
  };

  const handleViewStateChange = ({ viewState }: any) => {
    setViewState(viewState);
  };

  const openEventHandler = (event: Event) => {
    setOpenEvent(event);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Title Overlay */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-b from-black/90 to-gray-900/80 border border-amber-600/30 rounded-xl px-8 py-6 text-center shadow-2xl backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-amber-100 mb-2">
            Industrialización y Transformación Económica
          </h1>
          <p className="text-lg text-gray-300">
            Historia de Estados Unidos: 1877-1914
          </p>
          <p className="mt-3 text-sm text-gray-300 max-w-3xl leading-relaxed">
            Tesis: La rápida industrialización y el ascenso del poder
            corporativo (1877–1914) transformaron la vida
            estadounidense—impulsando la urbanización y la inmigración
            masiva—mientras provocaban regulaciones gubernamentales emblemáticas
            y activismo laboral que aún enmarcan los debates actuales sobre
            antimonopolio, protecciones laborales y seguridad del consumidor.
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
        onEventClick={handleTimelineEventClick}
        onEventHover={handleEventHover}
        openEventHandler={openEventHandler}
        selectedEvent={selectedEvent}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* Event Details Modal */}
      <EventModal event={openEvent} onClose={handleCloseModal} />

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
                Referencias y Lecturas Requeridas
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
                  Lecturas Requeridas
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
                    eventsData
                      .flatMap((e: any) => e.sources ?? [])
                      .filter(Boolean)
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
