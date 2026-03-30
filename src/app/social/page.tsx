"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });
const WaveField = dynamic(() => import("@/components/animations/WaveField"), { ssr: false });

interface NearbyUser {
  id: string;
  name: string;
  image: string;
  distance: string;
  interests: string[];
  bio: string;
  online: boolean;
  lookingFor: string;
}

const demoUsers: NearbyUser[] = [
  { id: "1", name: "Rohan Sharma", image: "", distance: "0.5 km", interests: ["Board Games", "Hiking", "Photography"], bio: "Always down for an adventure.", online: true, lookingFor: "Outdoor activities" },
  { id: "2", name: "Ananya Patel", image: "", distance: "1.2 km", interests: ["Art", "Cooking", "Music"], bio: "Creative soul looking for creative people.", online: true, lookingFor: "Art jams & music sessions" },
  { id: "3", name: "Alex Chen", image: "", distance: "0.8 km", interests: ["Sports", "Gaming", "Parkour"], bio: "Energy level: maximum.", online: true, lookingFor: "Sports & physical activities" },
  { id: "4", name: "Priya Reddy", image: "", distance: "2.1 km", interests: ["Photography", "Travel", "Food"], bio: "Weekend warrior. Photography walks anyone?", online: false, lookingFor: "Photography walks & food tours" },
  { id: "5", name: "Marcus Williams", image: "", distance: "1.5 km", interests: ["Gaming", "Board Games", "Karaoke"], bio: "Pro gamer by day, karaoke legend by night.", online: true, lookingFor: "Gaming sessions & karaoke" },
  { id: "6", name: "Sakura Tanaka", image: "", distance: "3.0 km", interests: ["Yoga", "Nature", "Stargazing"], bio: "Finding peace and fun in equal measure.", online: false, lookingFor: "Nature walks & stargazing" },
];

const upcomingEvents = [
  { id: "1", name: "Nerf Battle Royale", date: "Today, 4 PM", attendees: 8, max: 12, distance: "0.5 km" },
  { id: "2", name: "Sunset Bike Ride", date: "Tomorrow, 5 PM", attendees: 5, max: 10, distance: "1.2 km" },
  { id: "3", name: "Board Game Night", date: "Saturday, 2 PM", attendees: 4, max: 8, distance: "0.8 km" },
  { id: "4", name: "Rooftop Movie Night", date: "Sunday, 7 PM", attendees: 12, max: 20, distance: "2.0 km" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function getUserColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 50%, 65%)`;
}

export default function SocialPage() {
  const [view, setView] = useState<"people" | "events" | "map">("people");
  const [filter, setFilter] = useState<"all" | "online" | "nearby">("all");
  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);

  const filteredUsers = demoUsers.filter((u) => {
    if (filter === "online") return u.online;
    if (filter === "nearby") return parseFloat(u.distance) <= 1;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-dark pt-32 pb-20 px-8 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <WaveField color="white" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="label mb-6" style={{ color: "rgba(139,92,246,0.4)" }}>
            Community
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline mb-12"
            style={{ color: "rgba(200,180,255,0.9)" }}
          >
            Find your crew
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3">
            {(["people", "events", "map"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`chip capitalize ${view === v ? "active" : ""}`}>
                {v}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map View */}
      {view === "map" && (
        <section className="section-light py-20 md:py-32 px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <p className="label mb-10" style={{ color: "rgba(168,85,247,0.35)" }}>Nearby activity</p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[600px] overflow-hidden">
              <MapView />
            </motion.div>
          </div>
        </section>
      )}

      {/* People View */}
      {view === "people" && (
        <section className="section-light py-20 md:py-32 px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-12">
              <p className="label" style={{ color: "rgba(168,85,247,0.35)" }}>{filteredUsers.length} people nearby</p>
              <div className="flex gap-2">
                {(["all", "online", "nearby"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`chip-dark capitalize ${filter === f ? "active" : ""}`}>
                    {f === "nearby" ? "< 1km" : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-[1px]">
              {filteredUsers.map((user, i) => {
                const color = getUserColor(user.name);
                return (
                  <motion.div key={user.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    onClick={() => setSelectedUser(user)}
                    className="group cursor-pointer border-b border-black/[0.06] py-6 flex items-center gap-6 hover:pl-2 transition-all duration-500"
                  >
                    <div className="w-12 h-12 border flex items-center justify-center shrink-0"
                      style={{ borderColor: color.replace("65%", "30%") }}>
                      <span className="label text-[13px]" style={{ color }}>{getInitials(user.name)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="title text-[#0c0c0c] text-[clamp(1.1rem,2vw,1.4rem)]">{user.name}</h3>
                        {user.online && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                      </div>
                      <p className="body-sm text-black/30">{user.interests.join(" / ")}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="label" style={{ color: "rgba(168,85,247,0.25)" }}>{user.distance}</p>
                    </div>

                    <span className="text-lg shrink-0 transition-colors" style={{ color: "rgba(168,85,247,0.2)" }}>&rarr;</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Events View */}
      {view === "events" && (
        <section className="section-light py-20 md:py-32 px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <p className="label mb-12" style={{ color: "rgba(168,85,247,0.35)" }}>{upcomingEvents.length} happening soon</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
              {upcomingEvents.map((event, i) => {
                const hue = 240 + i * 35;
                return (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden mb-5" style={{ background: `linear-gradient(${135 + i * 45}deg, hsl(${hue}, 30%, 14%), hsl(${hue + 30}, 25%, 10%))` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                          className="w-[50%] h-[50%] rounded-full border"
                          style={{ borderColor: `hsla(${hue}, 50%, 60%, 0.08)` }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                          className="absolute w-3 h-3 rounded-full"
                          style={{ background: `hsla(${hue}, 50%, 60%, 0.15)` }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="label" style={{ color: `hsla(${hue}, 50%, 70%, 0.6)` }}>{event.attendees}/{event.max} joined</span>
                        <div className="w-full h-[2px] mt-2" style={{ background: `hsla(${hue}, 50%, 60%, 0.06)` }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(event.attendees / event.max) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
                            className="h-full"
                            style={{ background: `hsla(${hue}, 50%, 60%, 0.3)` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="label mb-2" style={{ color: "rgba(168,85,247,0.3)" }}>{event.date} &middot; {event.distance}</p>
                    <h3 className="title text-[#0c0c0c] mb-3">{event.name}</h3>
                    <button className="btn btn-light text-[11px]">Join</button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Animated divider */}
      <section className="relative h-[50vh] overflow-hidden section-dark">
        <div className="absolute inset-0">
          <WaveField color="white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline"
            style={{ color: "rgba(168,85,247,0.25)" }}
          >
            Better together
          </motion.h2>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-32 md:py-48 px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="label mb-8"
            style={{ color: "rgba(139,92,246,0.35)" }}
          >
            Join the community
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
            className="headline"
            style={{ color: "rgba(200,180,255,0.9)" }}
          >
            Your crew is
            <br />waiting for you
          </motion.h2>
        </div>
      </section>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-[#1a1a1a] max-w-xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[2/1] overflow-hidden" style={{ background: `linear-gradient(135deg, ${getUserColor(selectedUser.name).replace("65%", "12%")}, ${getUserColor(selectedUser.name).replace("65%", "8%")})` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border"
                    style={{ borderColor: getUserColor(selectedUser.name).replace("65%", "20%") }}
                  />
                  <div className="absolute flex items-center justify-center">
                    <span className="text-3xl font-extralight" style={{ color: getUserColor(selectedUser.name) }}>{getInitials(selectedUser.name)}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-xl bg-black/40 backdrop-blur"
                  style={{ color: "rgba(168,85,247,0.6)" }}>&times;</button>
                {selectedUser.online && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="label" style={{ color: "rgba(52,211,153,0.7)" }}>Online</span>
                  </div>
                )}
              </div>
              <div className="p-8">
                <p className="label mb-3" style={{ color: "rgba(168,85,247,0.3)" }}>{selectedUser.distance} away</p>
                <h2 className="title mb-4" style={{ color: "rgba(200,180,255,0.9)" }}>{selectedUser.name}</h2>
                <p className="body mb-6" style={{ color: "rgba(168,85,247,0.35)" }}>{selectedUser.bio}</p>

                <div className="mb-6">
                  <p className="label mb-3" style={{ color: "rgba(139,92,246,0.3)" }}>Looking for</p>
                  <p className="body-sm" style={{ color: "rgba(200,180,255,0.5)" }}>{selectedUser.lookingFor}</p>
                </div>

                <div className="mb-8">
                  <p className="label mb-3" style={{ color: "rgba(139,92,246,0.3)" }}>Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests.map((interest) => (
                      <span key={interest} className="chip text-[11px]">{interest}</span>
                    ))}
                  </div>
                </div>

                <button className="btn w-full justify-center">Say Hi</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
