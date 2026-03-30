import { NextResponse } from "next/server";
import { funAI } from "@/lib/ai-engine";

export async function GET() {
  const activities = funAI.getAllActivities();
  const generatedIdeas = funAI.generateNewIdeas(5);

  return NextResponse.json({
    success: true,
    count: activities.length,
    activities,
    generatedIdeas,
    stats: funAI.getStats(),
  });
}
