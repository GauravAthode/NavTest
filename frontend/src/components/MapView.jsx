import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import GlassCard from "./GlassCard.jsx";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({ planResult }) {
  const coords = planResult.route.geometry.coordinates; 
  const latLng = coords.map(([lng, lat]) => [lat, lng]);

  const center = latLng[Math.floor(latLng.length / 2)] || [23.2599, 77.4126];

  const stops = planResult.simulation.stops || [];

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="px-5 pt-5">
        <div className="text-sm font-semibold">Route Map</div>
        <div className="text-xs text-slate-400">Interactive map with route polyline and charging markers</div>
      </div>

      <div className="mt-4 h-[420px] w-full">
        <MapContainer center={center} zoom={7} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={latLng} />
          {stops.map((s, idx) => (
            <Marker key={idx} position={[s.location.lat, s.location.lng]} icon={markerIcon}>
              <Popup>
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs">Arrival SoC: {s.arrivalSoc}%</div>
                <div className="text-xs">Target SoC: {s.targetSoc}%</div>
                <div className="text-xs">Energy Added: {s.energyAddedKwh} kWh</div>
                <div className="text-xs">Time: {s.chargingTimeMin} min</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </GlassCard>
  );
}