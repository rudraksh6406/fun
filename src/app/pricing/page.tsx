"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics.",
    features: [
      { text: "Browse all activities", on: true },
      { text: "5 AI recommendations per day", on: true },
      { text: "Basic filters", on: true },
      { text: "View nearby events", on: true },
      { text: "AI idea generation", on: false },
      { text: "Train AI with your data", on: false },
      { text: "Connect with people", on: false },
      { text: "Create events", on: false },
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For people who mean it.",
    features: [
      { text: "Everything in Free", on: true },
      { text: "Unlimited recommendations", on: true },
      { text: "AI idea generation", on: true },
      { text: "Train AI with your activities", on: true },
      { text: "Advanced filters", on: true },
      { text: "Connect with nearby people", on: true },
      { text: "Create & host events", on: true },
      { text: "Priority processing", on: false },
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Ultra",
    price: "$19",
    period: "/month",
    description: "The full experience.",
    features: [
      { text: "Everything in Pro", on: true },
      { text: "Unlimited AI generation", on: true },
      { text: "Priority AI (2x faster)", on: true },
      { text: "Custom activity planner", on: true },
      { text: "Private groups", on: true },
      { text: "Activity analytics", on: true },
      { text: "Early access to features", on: true },
      { text: "Priority support", on: true },
    ],
    cta: "Go Ultra",
    highlight: false,
  },
];

const faqs = [
  { q: "Can I use masti.co for free?", a: "Yes. The free tier gives you access to all activities and 5 AI recommendations per day." },
  { q: "What does 'Train the AI' mean?", a: "You teach our AI your own activities. It learns patterns and generates similar but new ideas." },
  { q: "How does nearby people work?", a: "We use your location (with permission) to show people nearby who share similar interests." },
  { q: "Can I cancel anytime?", a: "Yes. No lock-in. Cancel anytime and keep access until the end of your billing period." },
  { q: "Is there a mobile app?", a: "Coming soon. Native iOS and Android apps with push notifications for nearby events." },
];

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-dark pt-32 pb-20 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="label text-purple-200/30 mb-6">
            Pricing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="headline text-purple-200 mb-8"
          >
            Simple,
            <br />transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="body text-purple-200/40 max-w-md mb-10"
          >
            Start free. Upgrade when you&apos;re ready for more.
          </motion.p>

          {/* Toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4">
            <span className={`label ${!annual ? "text-purple-200" : "text-purple-200/25"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-[1.5rem] border transition-colors ${annual ? "border-purple-400/40 bg-purple-400/10" : "border-purple-400/15"}`}>
              <motion.div animate={{ x: annual ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute top-[4px] w-3 h-3 bg-purple-400" />
            </button>
            <span className={`label ${annual ? "text-purple-200" : "text-purple-200/25"}`}>
              Annual <span className="text-purple-200/40 ml-1">-20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-light py-20 md:py-32 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <p className="label text-black/25 mb-12">Choose your plan</p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${tier.highlight ? "lg:-mt-4 lg:mb-4" : ""}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-0">
                    <span className="label text-black/60">Most popular</span>
                  </div>
                )}

                <div className={`border p-8 lg:p-10 h-full flex flex-col ${tier.highlight ? "border-black/20" : "border-black/[0.06]"}`}>
                  <p className="title text-[#0c0c0c] mb-2">{tier.name}</p>
                  <p className="body-sm text-black/40 mb-8">{tier.description}</p>

                  <div className="flex items-baseline gap-1 mb-10">
                    <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-light text-[#0c0c0c] leading-none">
                      {annual && tier.price !== "$0" ? `$${Math.round(parseInt(tier.price.slice(1)) * 0.8)}` : tier.price}
                    </span>
                    <span className="body-sm text-black/30">{tier.period}</span>
                  </div>

                  <div className="space-y-4 mb-10 flex-1">
                    {tier.features.map((f, j) => (
                      <div key={j} className={`flex items-start gap-3 ${f.on ? "text-black/60" : "text-black/20"}`}>
                        <span className="body-sm mt-0.5">{f.on ? "+" : "-"}</span>
                        <span className="body-sm">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/dashboard">
                    <button className={`btn w-full justify-center ${tier.highlight ? "btn-light bg-[#0c0c0c] text-purple-300 hover:bg-[#0c0c0c]/80" : "btn-light"}`}>
                      {tier.cta}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-dark py-20 md:py-32 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[380px_1fr] gap-16 lg:gap-24">
          <div>
            <motion.p {...fadeUp} className="label text-purple-200/30 mb-6">FAQ</motion.p>
            <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="title text-purple-200">
              Common
              <br />questions
            </motion.h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/[0.06]">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-6 flex items-center justify-between group">
                  <span className="body text-purple-200/60 group-hover:text-purple-200 transition-colors">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-200/20 text-lg shrink-0 ml-6">+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden">
                      <p className="body-sm text-purple-200/30 pb-6">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-light py-32 md:py-48 px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.p {...fadeUp} className="label text-black/30 mb-8">Get started</motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="headline text-[#0c0c0c] mb-12"
          >
            Ready to stop
            <br />being bored?
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <Link href="/dashboard">
              <button className="btn btn-light">Enter masti.co</button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
