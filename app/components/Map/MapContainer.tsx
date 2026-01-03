'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { SearchArea } from '../../types/business';

// Type for leaflet-draw created event
interface DrawCreatedEvent {
  layer: L.Layer;
  layerType: string;
}

interface MapContainerProps {
  onAreaSelected: (area: SearchArea) => void;
  isLoading?: boolean;
}

// Torrevieja center coordinates
const TORREVIEJA_CENTER: L.LatLngExpression = [37.9785, -0.6823];
const DEFAULT_ZOOM = 14;

export default function MapContainer({ onAreaSelected, isLoading }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  const handleCreated = useCallback(
    (e: DrawCreatedEvent) => {
      const layer = e.layer;

      // Clear previous drawings
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
        drawnItemsRef.current.addLayer(layer);
      }

      let area: SearchArea;

      if (e.layerType === 'rectangle' || e.layerType === 'polygon') {
        const latLngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
        const coordinates: [number, number][] = latLngs.map((ll) => [ll.lat, ll.lng]);

        area = {
          type: e.layerType === 'rectangle' ? 'rectangle' : 'polygon',
          coordinates,
        };
      } else if (e.layerType === 'circle') {
        const circle = layer as L.Circle;
        const center = circle.getLatLng();
        const radius = circle.getRadius();

        area = {
          type: 'circle',
          coordinates: [[center.lat, center.lng]],
          center: { lat: center.lat, lng: center.lng },
          radius,
        };
      } else {
        return;
      }

      onAreaSelected(area);
    },
    [onAreaSelected]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet default marker icons
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(TORREVIEJA_CENTER, DEFAULT_ZOOM);
    mapRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initialize drawn items layer
    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2,
          },
        },
        rectangle: {
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2,
          },
        },
        circle: {
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    // Handle draw events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('draw:created', handleCreated as any);

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handleCreated]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-gray-700">Söker efter svenska företag...</span>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">Så här gör du:</h3>
        <p className="text-gray-600 text-xs">
          Använd verktygen till höger för att rita ett område på kartan.
          Välj rektangel, polygon eller cirkel.
        </p>
      </div>
    </div>
  );
}
