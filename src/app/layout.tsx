import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "masti.co — Never Be Bored Again",
  description: "AI-powered activity recommendations. Tell us what you love, and we generate unlimited ideas tailored to your time, crew, and vibe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar />
          <main className="relative z-10">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
