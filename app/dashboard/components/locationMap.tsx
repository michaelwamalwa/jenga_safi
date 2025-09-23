'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationMapProps {
  locations: any[];
  center: [number, number];
  onMapClick: (coords: [number, number]) => void;
}

const LocationMap = ({ locations, center, onMapClick }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const loader = new Loader({ apiKey, version: 'weekly' });

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: center[1], lng: center[0] },
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const getMarkerIcon = (type: string): google.maps.Symbol => {
        const colorMap: Record<string, string> = {
          'construction-site': '#F97316',
          'warehouse': '#3B82F6',
          'supplier': '#8B5CF6',
          'office': '#10B981',
          'disposal': '#EF4444'
        };

        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: colorMap[type] || '#6B7280',
          fillOpacity: 0.9,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          scale: 8
        };
      };

      // Add click listener
      map.addListener('click', (e: any) => {
        onMapClick([e.latLng.lng(), e.latLng.lat()]);
      });

      // Add markers
      locations.forEach(location => {
        if (!location.coordinates?.coordinates) return;

        const marker = new google.maps.Marker({
          position: {
            lat: location.coordinates.coordinates[1],
            lng: location.coordinates.coordinates[0]
          },
          map,
          icon: getMarkerIcon(location.type),
          title: location.name
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-size: 14px;">
              <strong>${location.name}</strong><br/>
              ${location.address}<br/>
              <br/>
              <strong>Carbon:</strong> ${location.sustainabilityMetrics.carbonImpact} kg/day<br/>
              <strong>Projects:</strong> ${location.activeProjects} active
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    });
  }, [locations, center, apiKey]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-[500px] w-full rounded-lg" />
      {/* Legend (safe to keep outside map logic) */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-sm z-10">
        <div className="flex flex-wrap gap-2">
          {[
            ['construction-site', 'Construction Site'],
            ['warehouse', 'Warehouse'],
            ['supplier', 'Supplier'],
            ['disposal', 'Disposal']
          ].map(([type, label]) => (
            <div key={type} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: {
                  'construction-site': '#F97316',
                  'warehouse': '#3B82F6',
                  'supplier': '#8B5CF6',
                  'disposal': '#EF4444'
                }[type as string] || '#6B7280' }}
              />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
