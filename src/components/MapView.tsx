"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: "user" | "activity" | "group";
  emoji: string;
  description?: string;
}

// Fake nearby users/activities for demo
const demoLocations: MapPin[] = [
  { id: "1", lat: 28.6139, lng: 77.2090, label: "Nerf Battle @ Central Park", type: "activity", emoji: "🔫", description: "5 people joining - starts in 2hrs" },
  { id: "2", lat: 28.6200, lng: 77.2150, label: "Rohan's Group", type: "group", emoji: "👥", description: "3 people looking for fun" },
  { id: "3", lat: 28.6080, lng: 77.2200, label: "Art Jam Session", type: "activity", emoji: "🎨", description: "Free entry - bring your own supplies" },
  { id: "4", lat: 28.6250, lng: 77.2000, label: "Priya's Group", type: "group", emoji: "👥", description: "2 people, up for anything!" },
  { id: "5", lat: 28.6100, lng: 77.1950, label: "Sunset Bike Ride", type: "activity", emoji: "🚴", description: "Meeting at 5pm - 8 spots left" },
  { id: "6", lat: 28.6300, lng: 77.2100, label: "Board Game Night", type: "activity", emoji: "🎲", description: "Tonight 7pm - bring snacks!" },
  { id: "7", lat: 28.6180, lng: 77.2250, label: "Alex's Squad", type: "group", emoji: "👥", description: "4 people, looking for outdoor activities" },
  { id: "8", lat: 28.6050, lng: 77.2120, label: "Karaoke Night", type: "activity", emoji: "🎤", description: "Open mic starts at 8pm" },
];

export default function MapView({ onPinClick }: { onPinClick?: (pin: MapPin) => void }) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<unknown> | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get user's real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 28.6139, lng: 77.2090 }) // Default to Delhi
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      import("react-leaflet").then((RL) => {
        // Fix default marker icons
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const MapInner = () => {
          const center = userLocation || { lat: 28.6139, lng: 77.2090 };
          return (
            <RL.MapContainer
              center={[center.lat, center.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%", borderRadius: "20px" }}
              zoomControl={false}
            >
              <RL.TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
              {/* User marker */}
              {userLocation && (
                <RL.CircleMarker center={[userLocation.lat, userLocation.lng]} radius={8} pathOptions={{ color: "#ff2d95", fillColor: "#ff2d95", fillOpacity: 0.8 }}>
                  <RL.Popup>
                    <div style={{ color: "#000", fontWeight: "bold" }}>📍 You are here!</div>
                  </RL.Popup>
                </RL.CircleMarker>
              )}
              {/* Activity & group pins */}
              {demoLocations.map((pin) => (
                <RL.CircleMarker
                  key={pin.id}
                  center={[pin.lat, pin.lng]}
                  radius={pin.type === "activity" ? 10 : 7}
                  pathOptions={{
                    color: pin.type === "activity" ? "#00d4ff" : "#b14dff",
                    fillColor: pin.type === "activity" ? "#00d4ff" : "#b14dff",
                    fillOpacity: 0.6,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedPin(pin);
                      onPinClick?.(pin);
                    },
                  }}
                >
                  <RL.Popup>
                    <div style={{ color: "#000" }}>
                      <strong>{pin.emoji} {pin.label}</strong>
                      {pin.description && <p style={{ margin: "4px 0 0", fontSize: "12px" }}>{pin.description}</p>}
                    </div>
                  </RL.Popup>
                </RL.CircleMarker>
              ))}
            </RL.MapContainer>
          );
        };

        setMapComponent(() => MapInner);
      });
    });
  }, [userLocation, onPinClick]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Map */}
      <div className="w-full h-full rounded-2xl overflow-hidden border border-purple-400/10">
        {MapComponent ? (
          <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapComponent />
          </>
        ) : (
          <div className="w-full h-full glass flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              🌍
            </motion.div>
            <span className="ml-3 text-gray-400">Loading map...</span>
          </div>
        )}
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 z-[1000]">
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-pink" /> You
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-blue" /> Activities
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-purple" /> Groups
          </span>
        </div>
      </div>

      {/* Selected pin details */}
      {selectedPin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 glass-strong rounded-xl p-4 z-[1000] max-w-xs"
        >
          <button
            onClick={() => setSelectedPin(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-purple-300 text-sm"
          >
            ✕
          </button>
          <div className="text-2xl mb-1">{selectedPin.emoji}</div>
          <h4 className="font-bold text-sm">{selectedPin.label}</h4>
          {selectedPin.description && (
            <p className="text-xs text-gray-400 mt-1">{selectedPin.description}</p>
          )}
          <button className="btn-primary text-xs px-3 py-1.5 mt-2 w-full">
            {selectedPin.type === "activity" ? "Join Activity" : "Say Hi 👋"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
