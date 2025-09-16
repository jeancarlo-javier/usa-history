import DeckGL from '@deck.gl/react';
import { ColumnLayer } from '@deck.gl/layers';
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
  selectedYear: number;
  onEventClick: (event: Event) => void;
}

const INITIAL_VIEW_STATE = {
  longitude: -95.7129,
  latitude: 37.0902,
  zoom: 4,
  bearing: 0,
  pitch: 45
};

export default function Map3D({ selectedYear, onEventClick }: Map3DProps) {
  const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? undefined;

  const filteredEvents = eventsData.filter((event: Event) => event.year <= selectedYear);

  const layers = [
    new ColumnLayer<Event>({
      id: 'historical-events',
      data: filteredEvents,
      diskResolution: 12,
      radius: 8000,
      extruded: true,
      pickable: true,
      elevationScale: 1,
      getPosition: (d: Event) => [d.longitude, d.latitude],
      getFillColor: (d: Event) => {
        const age = selectedYear - d.year;
        const intensity = Math.max(0.3, 1 - age / 40);
        return [
          Math.round(255 * intensity),
          Math.round(100 * intensity),
          Math.round(50 * intensity),
          180
        ];
      },
      getElevation: (d: Event) => d.significance * 1500,
      updateTriggers: {
        getFillColor: [selectedYear],
        getElevation: [selectedYear]
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
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
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
