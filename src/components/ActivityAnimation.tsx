"use client";

import { motion } from "framer-motion";

/* Each activity gets a unique mini-animation that represents it */
const animations: Record<string, (i: number) => React.ReactNode> = {
  /* ── Nerf Gun Battle Royale ── */
  "Nerf Gun Battle Royale": (i) => (
    <>
      {/* Crosshair */}
      <motion.circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Bullets flying */}
      {[0, 1, 2].map((b) => (
        <motion.circle key={b} r="2" fill="currentColor" opacity="0.4"
          animate={{ cx: [20 + b * 10, 80 - b * 5], cy: [30 + b * 15, 60 - b * 8], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: b * 0.4 }} />
      ))}
    </>
  ),

  /* ── Midnight Cooking Challenge ── */
  "Midnight Cooking Challenge": (i) => (
    <>
      {/* Pan */}
      <ellipse cx="50" cy="60" rx="20" ry="8" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <line x1="70" y1="60" x2="85" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      {/* Steam */}
      {[0, 1, 2].map((s) => (
        <motion.path key={s}
          d={`M${44 + s * 6} 52 Q${42 + s * 6} 40 ${46 + s * 6} 30`}
          stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.15"
          animate={{ y: [0, -8, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2 + s * 0.5, repeat: Infinity, delay: s * 0.3 }} />
      ))}
    </>
  ),

  /* ── Urban Photography Walk ── */
  "Urban Photography Walk": (i) => (
    <>
      {/* Camera body */}
      <rect x="35" y="40" width="30" height="22" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="50" cy="51" r="7" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="50" cy="51" r="3" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Flash */}
      <motion.circle cx="50" cy="51" r="3" fill="currentColor" opacity="0"
        animate={{ opacity: [0, 0.5, 0], scale: [1, 3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }} />
    </>
  ),

  /* ── DIY Escape Room ── */
  "DIY Escape Room": (i) => (
    <>
      {/* Lock */}
      <motion.path d="M42 55 L42 48 A8 8 0 1 1 58 48 L58 55" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"
        animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }} />
      <rect x="38" y="55" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Keyhole */}
      <circle cx="50" cy="63" r="2.5" fill="currentColor" opacity="0.2" />
      <rect x="49" y="63" width="2" height="5" fill="currentColor" opacity="0.2" />
    </>
  ),

  /* ── Stargazing Night ── */
  "Stargazing Night": (i) => (
    <>
      {[...Array(12)].map((_, s) => (
        <motion.circle key={s}
          cx={20 + (s * 7) % 65} cy={20 + (s * 11) % 55}
          r={0.8 + (s % 3) * 0.5} fill="currentColor"
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 2 + s * 0.3, repeat: Infinity, delay: s * 0.2 }} />
      ))}
      {/* Shooting star */}
      <motion.line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.3"
        animate={{ x1: [15, 75], y1: [15, 50], x2: [20, 80], y2: [18, 53], opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
    </>
  ),

  /* ── Dance Session ── */
  "Dance Session": (i) => (
    <>
      {/* Stick figure dancing */}
      <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: "50px 45px" }}>
        <circle cx="50" cy="30" r="5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
        <line x1="50" y1="35" x2="50" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </motion.g>
      <motion.line x1="50" y1="55" x2="40" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.3"
        animate={{ x2: [40, 45, 40] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <motion.line x1="50" y1="55" x2="60" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.3"
        animate={{ x2: [60, 55, 60] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <motion.line x1="50" y1="42" x2="35" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.3"
        animate={{ x2: [35, 30, 35], y2: [50, 38, 50] }} transition={{ duration: 1, repeat: Infinity }} />
      <motion.line x1="50" y1="42" x2="65" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.3"
        animate={{ x2: [65, 70, 65], y2: [38, 50, 38] }} transition={{ duration: 1, repeat: Infinity }} />
      {/* Music notes */}
      <motion.text x="70" y="25" fontSize="10" fill="currentColor" opacity="0.2"
        animate={{ y: [25, 15], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }}>♪</motion.text>
    </>
  ),

  /* ── Board Game Marathon ── */
  "Board Game Marathon": (i) => (
    <>
      {/* Dice */}
      <motion.rect x="35" y="35" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3"
        animate={{ rotate: [0, 10, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "45px 45px" }} />
      <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="50" cy="40" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="40" cy="50" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="50" cy="50" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="45" cy="45" r="1.5" fill="currentColor" opacity="0.3" />
      {/* Second dice */}
      <motion.rect x="55" y="50" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.2"
        animate={{ rotate: [0, -8, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
        style={{ transformOrigin: "63px 58px" }} />
    </>
  ),

  /* ── Outdoor Cinema ── */
  "Outdoor Cinema": (i) => (
    <>
      {/* Screen */}
      <rect x="25" y="28" width="50" height="30" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Film reel flicker */}
      <motion.rect x="27" y="30" width="46" height="26" fill="currentColor" opacity="0.03"
        animate={{ opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 0.3, repeat: Infinity }} />
      {/* Projector beam */}
      <motion.polygon points="50,80 30,58 70,58" fill="currentColor" opacity="0.02"
        animate={{ opacity: [0.02, 0.04, 0.02] }} transition={{ duration: 2, repeat: Infinity }} />
    </>
  ),

  /* ── Parkour Session ── */
  "Parkour Session": (i) => (
    <>
      {/* Buildings/obstacles */}
      <rect x="15" y="55" width="18" height="25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
      <rect x="40" y="50" width="14" height="30" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
      <rect x="62" y="58" width="20" height="22" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
      {/* Runner */}
      <motion.g animate={{ x: [0, 60, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
        <circle cx="20" cy="45" r="3" fill="currentColor" opacity="0.4" />
        <motion.line x1="20" y1="48" x2="20" y2="56" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <motion.line x1="20" y1="56" x2="17" y2="62" stroke="currentColor" strokeWidth="0.6" opacity="0.3"
          animate={{ x2: [17, 23, 17] }} transition={{ duration: 0.4, repeat: Infinity }} />
      </motion.g>
    </>
  ),

  /* ── Karaoke Night ── */
  "Karaoke Night": (i) => (
    <>
      {/* Microphone */}
      <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "50px 60px" }}>
        <circle cx="50" cy="38" r="8" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
        <line x1="50" y1="46" x2="50" y2="68" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <ellipse cx="50" cy="70" rx="6" ry="3" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.2" />
      </motion.g>
      {/* Sound waves */}
      {[0, 1, 2].map((w) => (
        <motion.path key={w}
          d={`M${62 + w * 5} 33 Q${65 + w * 5} 38 ${62 + w * 5} 43`}
          stroke="currentColor" strokeWidth="0.6" fill="none"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: w * 0.3 }} />
      ))}
    </>
  ),

  /* ── Art Jam ── */
  "Art Jam": (i) => (
    <>
      {/* Palette */}
      <ellipse cx="45" cy="55" rx="18" ry="14" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
      {/* Paint blobs */}
      {[{ x: 38, y: 48 }, { x: 50, y: 47 }, { x: 35, y: 57 }, { x: 48, y: 60 }].map((p, idx) => (
        <motion.circle key={idx} cx={p.x} cy={p.y} r={2.5} fill="currentColor"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4 }} />
      ))}
      {/* Brush */}
      <motion.line x1="62" y1="35" x2="72" y2="25" stroke="currentColor" strokeWidth="1.2" opacity="0.3"
        animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "62px 35px" }} />
    </>
  ),

  /* ── Treasure Hunt ── */
  "Treasure Hunt": (i) => (
    <>
      {/* Map with X */}
      <rect x="30" y="30" width="35" height="30" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2"
        transform="rotate(-5 47 45)" />
      <motion.g animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
        <line x1="55" y1="40" x2="62" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="62" y1="40" x2="55" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </motion.g>
      {/* Dotted path */}
      <motion.path d="M35 55 L40 50 L45 53 L52 45" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3"
        fill="none" opacity="0.2" animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
    </>
  ),

  /* ── Sunset Bike Ride ── */
  "Sunset Bike Ride": (i) => (
    <>
      {/* Wheels */}
      <motion.circle cx="35" cy="58" r="10" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25"
        animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "35px 58px" }} />
      <motion.circle cx="65" cy="58" r="10" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25"
        animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "65px 58px" }} />
      {/* Spokes */}
      {[0, 60, 120].map((a) => (
        <motion.line key={`l${a}`} x1="35" y1="48" x2="35" y2="68" stroke="currentColor" strokeWidth="0.3" opacity="0.15"
          style={{ transformOrigin: "35px 58px", transform: `rotate(${a}deg)` }}
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      ))}
      {/* Frame */}
      <line x1="35" y1="58" x2="50" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="50" y1="48" x2="65" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="50" y1="48" x2="50" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      {/* Handlebars */}
      <line x1="47" y1="42" x2="53" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    </>
  ),

  /* ── Volleyball at the Park ── */
  "Volleyball at the Park": (i) => (
    <>
      {/* Net */}
      <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="50" y1="50" x2="50" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Ball */}
      <motion.circle cx="40" cy="35" r="6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35"
        animate={{ cx: [40, 60, 40], cy: [35, 25, 35] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M34 35 A6 6 0 0 1 46 35" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.2"
        animate={{ cx: [40, 60, 40] }} transition={{ duration: 2, repeat: Infinity }} />
    </>
  ),

  /* ── Gaming Tournament ── */
  "Gaming Tournament": (i) => (
    <>
      {/* Controller */}
      <rect x="32" y="42" width="36" height="20" rx="10" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* D-pad */}
      <line x1="42" y1="48" x2="42" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="38" y1="52" x2="46" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Buttons */}
      <motion.circle cx="58" cy="49" r="2" fill="currentColor" opacity="0.15"
        animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1, repeat: Infinity }} />
      <motion.circle cx="62" cy="52" r="2" fill="currentColor" opacity="0.15"
        animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
      <motion.circle cx="54" cy="52" r="2" fill="currentColor" opacity="0.15"
        animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
    </>
  ),

  /* ── Bonfire Night ── */
  "Bonfire Night": (i) => (
    <>
      {/* Logs */}
      <line x1="35" y1="68" x2="65" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <line x1="38" y1="72" x2="62" y2="69" stroke="currentColor" strokeWidth="2" opacity="0.15" />
      {/* Flames */}
      {[0, 1, 2].map((f) => (
        <motion.ellipse key={f}
          cx={46 + f * 4} cy={55} rx={3 + f} ry={10 + f * 2}
          fill="currentColor" opacity="0.08"
          animate={{ ry: [10 + f * 2, 14 + f * 2, 10 + f * 2], opacity: [0.08, 0.18, 0.08], cy: [55, 50, 55] }}
          transition={{ duration: 1 + f * 0.3, repeat: Infinity }} />
      ))}
      {/* Sparks */}
      {[0, 1, 2, 3].map((s) => (
        <motion.circle key={`s${s}`} r="1" fill="currentColor"
          animate={{ cx: [48 + s * 3, 45 + s * 5], cy: [48, 25 + s * 3], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: s * 0.5 }} />
      ))}
    </>
  ),

  /* ── Improv Comedy ── */
  "Improv Comedy": (i) => (
    <>
      {/* Stage spotlight */}
      <motion.ellipse cx="50" cy="72" rx="25" ry="6" fill="currentColor" opacity="0.04"
        animate={{ opacity: [0.04, 0.08, 0.04] }} transition={{ duration: 3, repeat: Infinity }} />
      {/* Spotlight beam */}
      <motion.polygon points="50,15 35,72 65,72" fill="currentColor" opacity="0.03"
        animate={{ opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Comedy/Tragedy masks */}
      <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx="40" cy="45" r="10" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M35 48 Q40 53 45 48" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
        <circle cx="37" cy="43" r="1" fill="currentColor" opacity="0.2" />
        <circle cx="43" cy="43" r="1" fill="currentColor" opacity="0.2" />
      </motion.g>
      <motion.g animate={{ x: [2, -2, 2] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx="60" cy="45" r="10" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M55 50 Q60 45 65 50" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
        <circle cx="57" cy="43" r="1" fill="currentColor" opacity="0.2" />
        <circle cx="63" cy="43" r="1" fill="currentColor" opacity="0.2" />
      </motion.g>
      {/* Laugh text */}
      <motion.text x="30" y="28" fontSize="7" fill="currentColor" opacity="0"
        animate={{ opacity: [0, 0.3, 0], y: [28, 20] }} transition={{ duration: 2.5, repeat: Infinity }}>HA</motion.text>
    </>
  ),

  /* ── Blanket Fort Cinema ── */
  "Blanket Fort Cinema": (i) => (
    <>
      {/* Fort shape — triangle */}
      <motion.polygon points="50,25 20,70 80,70" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2"
        animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: "50px 50px" }} />
      {/* Blanket drape */}
      <motion.path d="M20 70 Q35 65 50 70 Q65 75 80 70" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.15" />
      {/* Screen glow inside */}
      <motion.rect x="40" y="50" width="20" height="13" rx="1" fill="currentColor" opacity="0.04"
        animate={{ opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <rect x="40" y="50" width="20" height="13" rx="1" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Pillows */}
      <ellipse cx="30" cy="68" rx="6" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
      <ellipse cx="70" cy="68" rx="6" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
    </>
  ),

  /* ── Water Balloon War ── */
  "Water Balloon War": (i) => (
    <>
      {/* Balloons */}
      {[
        { cx: 35, cy: 40, delay: 0 },
        { cx: 55, cy: 35, delay: 0.5 },
        { cx: 68, cy: 45, delay: 1 },
      ].map((b, idx) => (
        <motion.g key={idx}>
          <motion.ellipse cx={b.cx} cy={b.cy} rx="7" ry="9" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.3"
            animate={{ cy: [b.cy, b.cy + 20], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: b.delay }} />
          {/* Splash */}
          <motion.g animate={{ scale: [0, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: b.delay + 1 }}
            style={{ transformOrigin: `${b.cx}px ${b.cy + 22}px` }}>
            {[0, 1, 2, 3, 4].map((s) => (
              <motion.circle key={s} cx={b.cx + Math.cos(s * 1.26) * 8} cy={b.cy + 22 + Math.sin(s * 1.26) * 6}
                r="1.5" fill="currentColor" opacity="0.3" />
            ))}
          </motion.g>
        </motion.g>
      ))}
      {/* Water drops */}
      {[0, 1, 2, 3].map((d) => (
        <motion.circle key={`d${d}`} r="1" fill="currentColor"
          animate={{ cx: [30 + d * 12, 32 + d * 12], cy: [25 + d * 5, 75], opacity: [0.2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.3 }} />
      ))}
    </>
  ),

  /* ── Podcast Session ── */
  "Podcast Session": (i) => (
    <>
      {/* Microphone on stand */}
      <rect x="47" y="32" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <line x1="50" y1="50" x2="50" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="43" y1="65" x2="57" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Sound waves — left */}
      {[0, 1, 2].map((w) => (
        <motion.path key={`l${w}`}
          d={`M${40 - w * 5} 35 Q${37 - w * 5} 42 ${40 - w * 5} 48`}
          stroke="currentColor" strokeWidth="0.6" fill="none"
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: w * 0.3 }} />
      ))}
      {/* Sound waves — right */}
      {[0, 1, 2].map((w) => (
        <motion.path key={`r${w}`}
          d={`M${60 + w * 5} 35 Q${63 + w * 5} 42 ${60 + w * 5} 48`}
          stroke="currentColor" strokeWidth="0.6" fill="none"
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: w * 0.3 }} />
      ))}
      {/* Recording indicator */}
      <motion.circle cx="72" cy="30" r="3" fill="currentColor" opacity="0.1"
        animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </>
  ),

  /* ── Night Hike ── */
  "Night Hike": (i) => (
    <>
      {/* Mountain silhouette */}
      <polygon points="10,75 35,35 60,75" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
      <polygon points="40,75 65,30 90,75" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.12" />
      {/* Moon */}
      <motion.circle cx="75" cy="22" r="6" fill="currentColor" opacity="0.08"
        animate={{ opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 4, repeat: Infinity }} />
      {/* Stars */}
      {[{ x: 20, y: 18 }, { x: 55, y: 15 }, { x: 85, y: 25 }, { x: 30, y: 28 }].map((s, idx) => (
        <motion.circle key={idx} cx={s.x} cy={s.y} r="0.8" fill="currentColor"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2 + idx * 0.5, repeat: Infinity, delay: idx * 0.3 }} />
      ))}
      {/* Flashlight beam */}
      <motion.polygon points="45,55 30,75 55,75" fill="currentColor" opacity="0.03"
        animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Hiker */}
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <circle cx="45" cy="50" r="3" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
        <line x1="45" y1="53" x2="45" y2="62" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
        <line x1="45" y1="62" x2="41" y2="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1="45" y1="62" x2="49" y2="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </motion.g>
    </>
  ),

  /* ── Rooftop Sunset ── */
  "Rooftop Sunset": (i) => (
    <>
      {/* Sun */}
      <motion.circle cx="50" cy="35" r="12" fill="currentColor" opacity="0.06"
        animate={{ opacity: [0.06, 0.12, 0.06], cy: [35, 38, 35] }}
        transition={{ duration: 6, repeat: Infinity }} />
      {/* Sun rays */}
      {[...Array(8)].map((_, r) => {
        const angle = (r / 8) * Math.PI * 2;
        return (
          <motion.line key={r}
            x1={50 + Math.cos(angle) * 15} y1={35 + Math.sin(angle) * 15}
            x2={50 + Math.cos(angle) * 22} y2={35 + Math.sin(angle) * 22}
            stroke="currentColor" strokeWidth="0.5" opacity="0.1"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: r * 0.2 }} />
        );
      })}
      {/* Building skyline */}
      <rect x="15" y="55" width="12" height="25" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.15" />
      <rect x="30" y="50" width="10" height="30" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.12" />
      <rect x="55" y="52" width="15" height="28" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.15" />
      <rect x="73" y="58" width="12" height="22" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.12" />
      {/* Horizon line */}
      <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
    </>
  ),

  /* ── Tie-Dye Workshop ── */
  "Tie-Dye Workshop": (i) => (
    <>
      {/* T-shirt outline */}
      <path d="M35 35 L30 45 L38 48 L38 70 L62 70 L62 48 L70 45 L65 35 L57 40 L43 40 Z"
        stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25" />
      {/* Spiral tie-dye pattern */}
      <motion.circle cx="50" cy="55" r="4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15"
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 55px" }} />
      <motion.circle cx="50" cy="55" r="8" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.1"
        animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 55px" }} />
      <motion.circle cx="50" cy="55" r="12" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.08"
        animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 55px" }} />
      {/* Color drips */}
      {[0, 1, 2].map((d) => (
        <motion.circle key={d} r="2" fill="currentColor"
          animate={{ cx: [45 + d * 5, 44 + d * 5], cy: [70, 80], opacity: [0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: d * 0.6 }} />
      ))}
    </>
  ),

  /* ── Spontaneous Road Trip ── */
  "Spontaneous Road Trip": (i) => (
    <>
      {/* Road */}
      <line x1="50" y1="80" x2="50" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.15" />
      <line x1="30" y1="80" x2="45" y2="20" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      <line x1="70" y1="80" x2="55" y2="20" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      {/* Car */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
        <rect x="43" y="52" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
        <rect x="45" y="48" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.2" />
      </motion.g>
      {/* Speed lines */}
      {[0, 1, 2].map((l) => (
        <motion.line key={l} x1={46 + l * 3} y1="65" x2={46 + l * 3} y2="70"
          stroke="currentColor" strokeWidth="0.5" opacity="0.15"
          animate={{ y1: [65, 75], y2: [70, 80], opacity: [0.2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: l * 0.2 }} />
      ))}
    </>
  ),
};

/* Fallback: generate a simple geometric animation from the activity name */
function FallbackAnimation({ name, index }: { name: string; index: number }) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const shapes = Math.abs(hash % 3) + 2;
  const baseAngle = Math.abs(hash % 360);

  return (
    <>
      {[...Array(shapes)].map((_, s) => {
        const size = 12 + s * 8;
        const isCircle = (hash + s) % 2 === 0;
        return isCircle ? (
          <motion.circle key={s} cx="50" cy="50" r={size}
            stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.05 + s * 0.03}
            animate={{ rotate: (s % 2 === 0 ? 1 : -1) * 360 }}
            transition={{ duration: 15 + s * 5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }} />
        ) : (
          <motion.rect key={s} x={50 - size} y={50 - size} width={size * 2} height={size * 2}
            stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.04 + s * 0.02}
            animate={{ rotate: (s % 2 === 0 ? 1 : -1) * 360 }}
            transition={{ duration: 20 + s * 5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }} />
        );
      })}
      <motion.circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.15"
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }} />
    </>
  );
}

interface Props {
  name: string;
  index: number;
}

export default function ActivityAnimation({ name, index }: Props) {
  const renderFn = animations[name];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {renderFn ? renderFn(index) : <FallbackAnimation name={name} index={index} />}
    </svg>
  );
}
