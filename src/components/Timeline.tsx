import React from "react";
import eventsData from "../events.json";

interface Event {
  id: number;
  title: string;
  year: number;
  prominent?: boolean;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  modernConnection: string;
  significance: number;
}

interface TimelineProps {
  onEventClick: (event: Event) => void;
  onEventHover: (event: Event | null) => void;
  openEventHandler: (event: Event) => void;
  selectedEvent: Event | null;
  minYear: number;
  maxYear: number;
}

export default function Timeline({
  onEventClick,
  onEventHover,
  selectedEvent,
  openEventHandler,
  minYear,
  maxYear,
}: TimelineProps) {
  const handleEventClick = (event: Event) => {
    onEventClick(event);
  };

  const openEventClick = (event: Event) => {
    openEventHandler(event);
  };

  // Measure the timeline track to compute pixel-accurate positions and anti-overlap lanes
  const trackContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [trackMetrics, setTrackMetrics] = React.useState({
    width: 0,
    padLeft: 0,
    padRight: 0,
  });

  React.useLayoutEffect(() => {
    const el = trackContainerRef.current;
    if (!el) return;

    const update = () => {
      const style = getComputedStyle(el);
      const padLeft = parseFloat(style.paddingLeft || "0");
      const padRight = parseFloat(style.paddingRight || "0");
      const width = el.clientWidth - padLeft - padRight;
      setTrackMetrics({ width: Math.max(0, width), padLeft, padRight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  type LaidOutEvent = {
    event: Event;
    xPx: number; // absolute pixel position within the track (content box)
    lane: number; // 0 is center line, 1..N are alternating above/below
  };

  const laidOutEvents: LaidOutEvent[] = React.useMemo(() => {
    const width = trackMetrics.width || 1; // avoid divide-by-zero
    const minPxSpacing = 22; // minimum horizontal spacing between events in same lane

    // Map event -> x position in pixels within the track
    const withX = eventsData.map((e) => ({
      event: e,
      xPx: ((e.year - minYear) / Math.max(1, maxYear - minYear)) * width,
    }));

    // Sort by x to lay out left-to-right
    withX.sort((a, b) => a.xPx - b.xPx);

    // Track the last x for each lane to avoid collisions
    const laneLastX: number[] = [];
    const result: LaidOutEvent[] = [];

    for (const item of withX) {
      let lane = 0;
      // Find the first lane where we have enough horizontal spacing
      while (
        typeof laneLastX[lane] === "number" &&
        item.xPx - laneLastX[lane] < minPxSpacing
      ) {
        lane += 1;
      }
      laneLastX[lane] = item.xPx;
      result.push({ event: item.event, xPx: item.xPx, lane });
    }

    return result;
  }, [minYear, maxYear, trackMetrics.width]);

  // Convert lane index to vertical offset around center: 0 -> 0, 1 -> -1, 2 -> +1, 3 -> -2, ...
  const laneIndexToSignedLevel = (lane: number) => {
    if (lane === 0) return 0;
    const k = Math.ceil(lane / 2);
    return lane % 2 === 1 ? -k : k;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent text-white shadow-2xl">
      <div className="px-6 py-8">
        {/* Timeline Container */}
        <div ref={trackContainerRef} className="relative px-8 py-16">
          {/* Horizontal Timeline Line with gradient */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transform -translate-y-1/2 z-10 shadow-lg"></div>

          {/* Year markers */}
          <div className="absolute top-1/2 left-8 right-8 transform -translate-y-1/2 z-5">
            {[minYear, Math.floor((minYear + maxYear) / 2), maxYear].map(
              (year, idx) => (
                <div
                  key={year}
                  className="absolute text-xs text-gray-400 -bottom-8"
                  style={{
                    left: `${idx * 50}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {year}
                </div>
              )
            )}
          </div>

          {/* Events Container */}
          <div className="relative">
            {/* Timeline Events with lane-based anti-overlap */}
            {laidOutEvents.map(({ event, xPx, lane }) => {
              const signedLevel = laneIndexToSignedLevel(lane);
              const laneGapPx = 28; // vertical distance between lanes
              const topOffsetPx = signedLevel * laneGapPx;
              const isAbove = signedLevel < 0; // place labels accordingly
              const isMostImportant = !!event.prominent;
              const isImportant = !isMostImportant && event.significance >= 9;

              return (
                <div
                  key={event.id}
                  className={`absolute flex flex-col items-center group transition-all duration-300 ${
                    selectedEvent?.id === event.id ? "z-50" : "z-20 hover:z-50"
                  }`}
                  style={{
                    left: `${xPx}px`,
                    top: `calc(50% + ${topOffsetPx}px)`,
                    transform: "translateX(-50%)",
                  }}
                  onMouseEnter={() => onEventHover(event)}
                  onMouseLeave={() => onEventHover(null)}
                >
                  {/* Background vertical highlight for most important events */}
                  {isMostImportant && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-amber-500/25 rounded-sm pointer-events-none -z-10"
                      style={{ left: "50%", transform: "translateX(-50%)" }}
                    />
                  )}

                  {/* Event Name (floating tooltip or permanent) */}
                  {isMostImportant ? (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 text-center transition-all duration-300 group-hover:scale-105 ${
                        isAbove ? "-top-24" : "top-full mt-4"
                      }`}
                    >
                      {/* Connector line for prominent events */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-px bg-amber-400/50 ${
                          isAbove
                            ? "top-full h-4"
                            : "top-0 -translate-y-full h-4"
                        }`}
                      ></div>

                      <div className="bg-amber-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-600/30">
                        <div className="text-sm font-bold text-amber-100 whitespace-nowrap">
                          {event.title}
                        </div>
                        <div className="text-xs text-amber-300 whitespace-nowrap font-medium">
                          {event.year}
                        </div>
                        <button
                          onClick={() => openEventClick(event)}
                          className="text-xs text-amber-400 hover:text-amber-200 transition-colors duration-200 mt-1"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`absolute ${
                        isAbove ? "bottom-full mb-3" : "top-full mt-3"
                      } left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-50`}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-gray-300">{event.year}</div>
                      <button
                        onClick={() => openEventClick(event)}
                        className="text-blue-400 hover:underline mt-1 text-xs"
                      >
                        Read More
                      </button>
                      {/* Tooltip arrow */}
                      <div
                        className={`absolute ${
                          isAbove ? "top-full" : "bottom-full"
                        } left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-b-4 border-transparent ${
                          isAbove
                            ? "border-t-gray-900/95"
                            : "border-b-gray-900/95"
                        }`}
                      ></div>
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
                          ? "border-white bg-red-500 shadow-red-500/50"
                          : isMostImportant
                            ? "border-amber-300 bg-amber-500 shadow-amber-500/30 group-hover:bg-amber-400"
                            : isImportant
                              ? "border-amber-200 bg-amber-400 shadow-amber-400/30 group-hover:bg-amber-300"
                              : "border-gray-400 bg-gray-600 shadow-gray-600/30 group-hover:bg-gray-500"
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Inner dot for prominent events */}
                      {isMostImportant && (
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
