import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import eventsData from '../events.json';

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

interface Map3DProps {
  onEventClick: (event: Event) => void;
  viewState: any;
  onViewStateChange: (viewState: any) => void;
  selectedEvent: Event | null;
  hoveredEvent: Event | null;
}

export default function Map3D({ onEventClick, viewState, onViewStateChange, selectedEvent, hoveredEvent }: Map3DProps) {
  const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? undefined;

  const layers = [
    new ScatterplotLayer<Event>({
      id: 'historical-events',
      data: eventsData,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 8,
      radiusMinPixels: 5,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d: Event) => [d.longitude, d.latitude],
      getRadius: (d: Event) => {
        const baseRadius = d.significance;
        if (selectedEvent && d.id === selectedEvent.id) {
          return baseRadius * 2;
        }
        if (hoveredEvent && d.id === hoveredEvent.id) {
          return baseRadius * 1.25;
        }
        return baseRadius;
      },
      getFillColor: (d: Event) => {
        if (selectedEvent && d.id === selectedEvent.id) {
          return [255, 0, 0, 255];
        } else if (hoveredEvent && d.id === hoveredEvent.id) {
          return [255, 140, 0, 255];
        }
        const intensity = d.significance / 10;
        return [255, 140, 0, Math.round(255 * intensity)];
      },
      getLineColor: (d: Event) => {
        if ((selectedEvent && d.id === selectedEvent.id) || (hoveredEvent && d.id === hoveredEvent.id)) {
          return [255, 255, 255];
        }
        return [0, 0, 0, 180];
      },
      getLineWidth: (d: Event) => {
        if ((selectedEvent && d.id === selectedEvent.id) || (hoveredEvent && d.id === hoveredEvent.id)) {
          return 2;
        }
        return 1;
      },
      onHover: (info: PickingInfo<Event>) => {
        if (info.object) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      },
      onClick: (info: PickingInfo<Event>) => {
        if (info.object) {
          onEventClick(info.object);
        }
      }
    })
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={{dragRotate: true, dragPan: false, scrollZoom: false}}
      layers={layers}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
      getTooltip={({object}) => object ? `${object.title} (${object.year})` : null}
    >
      {mapboxToken && (
        <Map
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          reuseMaps
          attributionControl={false}
          style={{width: '100%', height: '100%'}}
        />
      )}
    </DeckGL>
  );
}
