import { NextRequest, NextResponse } from "next/server";
import { funAI } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { availableTime, numberOfPeople, availableMaterials, mood, preferences } = body;

  const recommendations = funAI.getRecommendations({
    availableTime: availableTime || 60,
    numberOfPeople: numberOfPeople || 2,
    availableMaterials: availableMaterials || [],
    mood: mood || "excited",
    preferences,
  });

  return NextResponse.json({
    success: true,
    count: recommendations.length,
    recommendations,
    stats: funAI.getStats(),
  });
}
