"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const NerfTransition = dynamic(
  () => import("@/components/NerfTransition").then((m) => ({ default: m.NerfTransitionProvider })),
  { ssr: false }
);

export default function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    <NerfTransition>
      <CustomCursor />
      {children}
    </NerfTransition>
  );
}
