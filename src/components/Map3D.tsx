import DeckGL from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import MapGL from "react-map-gl/mapbox";
import type { PickingInfo } from "@deck.gl/core";
import { useMemo } from "react";
import eventsData from "../events.json";

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
  displayLatitude?: number;
  displayLongitude?: number;
}

interface Map3DProps {
  onEventClick: (event: Event) => void;
  viewState: any;
  onViewStateChange: (viewState: any) => void;
  selectedEvent: Event | null;
  hoveredEvent: Event | null;
}

export default function Map3D({
  onEventClick,
  viewState,
  onViewStateChange,
  selectedEvent,
  hoveredEvent,
}: Map3DProps) {
  const mapboxToken =
    (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? undefined;

  // De-overlap events by applying a small, deterministic spiral offset for stacks at identical coordinates
  const positionedEvents: Event[] = useMemo(() => {
    const list = (eventsData as Event[]).map((e) => ({ ...e }));
    const groups = new Map<string, Event[]>();
    for (const ev of list) {
      const key = `${ev.latitude},${ev.longitude}`;
      const arr = groups.get(key) ?? [];
      arr.push(ev);
      groups.set(key, arr);
    }

    const GOLDEN_ANGLE = 2.39996322972865332; // radians
    const BASE_KM = 5; // base radius for the spiral in kilometers
    const KM_PER_DEG_LAT = 111.32;

    for (const [, evs] of groups) {
      if (evs.length <= 1) continue;
      const baseLat = evs[0].latitude;
      const latRad = (baseLat * Math.PI) / 180;
      const kmPerDegLon = Math.max(1e-6, KM_PER_DEG_LAT * Math.cos(latRad));

      evs.forEach((ev: Event, idx: number) => {
        if (idx === 0) {
          ev.displayLatitude = ev.latitude;
          ev.displayLongitude = ev.longitude;
          return;
        }
        const rKm = BASE_KM * Math.sqrt(idx);
        const theta = GOLDEN_ANGLE * idx;
        const dyDeg = (rKm * Math.sin(theta)) / KM_PER_DEG_LAT;
        const dxDeg = (rKm * Math.cos(theta)) / kmPerDegLon;
        ev.displayLatitude = ev.latitude + dyDeg;
        ev.displayLongitude = ev.longitude + dxDeg;
      });
    }

    return list;
  }, []);

  const layers = [
    new IconLayer<Event>({
      id: "historical-events-pins",
      data: positionedEvents,
      pickable: true,
      // Use a local SVG and let Deck.gl auto-pack it
      getIcon: () => ({
        url: "/pin.svg",
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true,
      }),
      sizeScale: 6,
      getPosition: (d: Event) => [
        d.displayLongitude ?? d.longitude,
        d.displayLatitude ?? d.latitude,
      ],
      getSize: (d: Event) => {
        // Base size influenced by significance; emphasize selected/hovered
        const base = 2 + d.significance * 1.5; // ~3 to ~17 px before scale
        if (selectedEvent && d.id === selectedEvent.id) return base * 1.6;
        if (hoveredEvent && d.id === hoveredEvent.id) return base * 1.3;
        return base;
      },
      getColor: (d: Event) => {
        if (selectedEvent && d.id === selectedEvent.id) return [255, 0, 0, 255];
        if (hoveredEvent && d.id === hoveredEvent.id) return [255, 140, 0, 255];
        const intensity = d.significance / 10;
        return [
          255,
          Math.round(140 * intensity),
          0,
          Math.round(200 + 55 * intensity),
        ];
      },
      onHover: (info: PickingInfo<Event>) => {
        if (info.object) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
      },
      onClick: (info: PickingInfo<Event>) => {
        if (info.object) {
          onEventClick(info.object);
        }
      },
      updateTriggers: {
        getSize: [selectedEvent?.id, hoveredEvent?.id],
        getColor: [selectedEvent?.id, hoveredEvent?.id],
      },
    }),
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={{
        dragRotate: true,
        dragPan: true,
        scrollZoom: true,
        touchZoom: true,
        touchRotate: true,
      }}
      layers={layers}
      style={{ position: "relative", width: "100%", height: "100vh" }}
      getTooltip={({ object }) =>
        object ? `${object.title} (${object.year})` : null
      }
    >
      {mapboxToken && (
        <MapGL
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          reuseMaps
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </DeckGL>
  );
}
