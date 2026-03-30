import { NextRequest, NextResponse } from "next/server";

// Simulated nearby users and events
const nearbyUsers = [
  { id: "1", name: "Rohan", avatar: "🧑‍💻", lat: 28.6200, lng: 77.2150, interests: ["Board Games", "Hiking"], online: true },
  { id: "2", name: "Ananya", avatar: "👩‍🎨", lat: 28.6080, lng: 77.2200, interests: ["Art", "Music"], online: true },
  { id: "3", name: "Alex", avatar: "🏃", lat: 28.6250, lng: 77.2000, interests: ["Sports", "Gaming"], online: true },
  { id: "4", name: "Priya", avatar: "📸", lat: 28.6100, lng: 77.1950, interests: ["Photography", "Travel"], online: false },
  { id: "5", name: "Marcus", avatar: "🎮", lat: 28.6300, lng: 77.2100, interests: ["Gaming", "Karaoke"], online: true },
];

const nearbyEvents = [
  { id: "e1", name: "Nerf Battle", emoji: "🔫", lat: 28.6139, lng: 77.2090, attendees: 8, time: "Today 4PM" },
  { id: "e2", name: "Sunset Ride", emoji: "🚴", lat: 28.6180, lng: 77.2250, attendees: 5, time: "Tomorrow 5PM" },
  { id: "e3", name: "Board Games", emoji: "🎲", lat: 28.6050, lng: 77.2120, attendees: 4, time: "Saturday 2PM" },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { lat, lng, radius = 5 } = body;

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const users = nearbyUsers
    .map((u) => ({
      ...u,
      distance: Math.round(getDistance(lat, lng, u.lat, u.lng) * 10) / 10,
    }))
    .filter((u) => u.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const events = nearbyEvents
    .map((e) => ({
      ...e,
      distance: Math.round(getDistance(lat, lng, e.lat, e.lng) * 10) / 10,
    }))
    .filter((e) => e.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return NextResponse.json({
    success: true,
    users,
    events,
    totalNearby: users.length + events.length,
  });
}
