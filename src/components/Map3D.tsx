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
}

export default function Map3D({ onEventClick, viewState, onViewStateChange }: Map3DProps) {
  const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? undefined;

  const layers = [
    new ScatterplotLayer<Event>({
      id: 'historical-events',
      data: eventsData,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 5,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d: Event) => [d.longitude, d.latitude],
      getFillColor: (d: Event) => {
        const intensity = d.significance / 10;
        return [255, 140, 0, Math.round(255 * intensity)];
      },
      getLineColor: [0, 0, 0],
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
