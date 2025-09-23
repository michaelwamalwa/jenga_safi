"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet with Next.js
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default markers
const DefaultIcon = new L.Icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Material location type
interface MaterialLocation {
  lat: number;
  lng: number;
  material: string;
  quantity: number;
  distance: number; // km from construction site
  carbonImpact: number; // kg CO₂
  isLocal: boolean;
}

interface SustainabilityMapProps {
  location: string; // e.g. "Nairobi, Kenya"
  materials: {
    name: string;
    quantity: number;
    carbonPerUnit: number;
    isRecycled: boolean;
  }[];
}

// --- Free OSM Geocoder (Nominatim) ---
async function geocodeLocation(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

// Custom icon for construction site
const createConstructionIcon = () => {
  return new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export default function SustainabilityMap({ location, materials }: SustainabilityMapProps) {
  const [baseCoords, setBaseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Geocode site location on mount/update
  useEffect(() => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    geocodeLocation(location)
      .then((coords) => {
        if (coords) {
          setBaseCoords(coords);
        } else {
          setError("Location not found. Please try a different location name.");
          setBaseCoords(null);
        }
      })
      .catch((err) => {
        setError("Failed to geocode location. Please check your connection.");
        console.error("Geocoding error:", err);
        setBaseCoords(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location]);

  // Generate material locations around baseCoords
  const materialLocations = useMemo<MaterialLocation[]>(() => {
    if (!baseCoords || materials.length === 0) return [];
    
    return materials.map((material) => {
      const offset = () => (Math.random() * 2 - 1) * 0.5;
      const isLocal = Math.random() > 0.6;
      const materialLat = baseCoords.lat + (isLocal ? offset() * 0.1 : offset() * 2);
      const materialLng = baseCoords.lng + (isLocal ? offset() * 0.1 : offset() * 2);
      
      // Calculate distance in km using Haversine formula (more accurate)
      const R = 6371; // Earth's radius in km
      const dLat = (materialLat - baseCoords.lat) * Math.PI / 180;
      const dLng = (materialLng - baseCoords.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(baseCoords.lat * Math.PI / 180) * Math.cos(materialLat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return {
        lat: materialLat,
        lng: materialLng,
        material: material.name,
        quantity: material.quantity,
        distance,
        carbonImpact: material.quantity * material.carbonPerUnit * (isLocal ? 0.8 : 1.2) * (distance > 100 ? 1.5 : 1),
        isLocal,
      };
    });
  }, [baseCoords, materials]);

  if (!isClient) {
    return <div className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>;
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Finding location and calculating routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!baseCoords) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p>Enter a location to see the sustainability map</p>
      </div>
    );
  }

  const constructionIcon = createConstructionIcon();

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[baseCoords.lat, baseCoords.lng]}
        zoom={10}
        className="h-96 w-full rounded-lg border border-gray-200"
        zoomControl={true}
      >
        {/* OpenStreetMap tiles (free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Construction Site */}
        <Marker
          position={[baseCoords.lat, baseCoords.lng]}
          icon={constructionIcon}
        >
          <Popup>
            <div className="text-sm">
              <strong>🏗️ Construction Site</strong>
              <p>{location}</p>
              <p className="text-xs text-gray-600">Total materials: {materials.length}</p>
            </div>
          </Popup>
        </Marker>

        {/* Material Locations + lines */}
        {materialLocations.map((loc, i) => (
          <div key={i}>
            <CircleMarker
              center={[loc.lat, loc.lng]}
              radius={6 + Math.log(loc.quantity) * 2}
              color={loc.isLocal ? "green" : "red"}
              fillColor={loc.isLocal ? "green" : "red"}
              fillOpacity={0.7}
              weight={2}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{loc.material}</h3>
                  <p>Quantity: {loc.quantity} units</p>
                  <p>Distance: {loc.distance.toFixed(1)} km</p>
                  <p>Carbon Impact: {loc.carbonImpact.toFixed(1)} kg CO₂</p>
                  <p className={loc.isLocal ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {loc.isLocal ? "✅ Local Sourcing" : "⚠️ Distant Sourcing"}
                  </p>
                  {loc.isLocal && (
                    <p className="text-xs text-green-500">~20% carbon savings from local sourcing</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>

            <Polyline
              positions={[
                [loc.lat, loc.lng],
                [baseCoords.lat, baseCoords.lng],
              ]}
              color={loc.isLocal ? "green" : "red"}
              weight={1 + Math.log(loc.carbonImpact) / 3}
              opacity={0.6}
            />
          </div>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm z-10 text-xs border">
        <div className="font-semibold mb-2 text-sm">Legend</div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          Construction Site
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          Local Materials (lower carbon)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          Distant Materials (higher carbon)
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-green-500 mr-2"></div>
            <span className="text-xs">Thicker line = higher carbon impact</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm z-10 text-xs border">
        <div className="font-semibold mb-2">Carbon Impact Summary</div>
        <div>Total Materials: {materials.length}</div>
        <div>
          Local Sources: {materialLocations.filter(loc => loc.isLocal).length}
        </div>
        <div>
          Total Carbon: {materialLocations.reduce((sum, loc) => sum + loc.carbonImpact, 0).toFixed(1)} kg CO₂
        </div>
      </div>
    </div>
  );
}