"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Explore", path: "/explore" },
  { name: "AI Engine", path: "/dashboard" },
  { name: "People", path: "/social" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > 100 && latest > prev);
  });

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-6 flex items-center justify-between">
        <Link href="/">
          <span className="text-[15px] font-light tracking-[0.05em] text-white">
            masti.co
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <span
                className={`text-[12px] tracking-[0.12em] uppercase transition-opacity duration-300 ${
                  pathname === item.path ? "text-white opacity-100" : "text-white opacity-40 hover:opacity-70"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
