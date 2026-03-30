import { NextRequest, NextResponse } from "next/server";
import { funAI } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { activities } = body;

  if (!activities || !Array.isArray(activities)) {
    return NextResponse.json({ error: "activities array is required" }, { status: 400 });
  }

  const totalActivities = funAI.train(activities);

  return NextResponse.json({
    success: true,
    message: `AI trained successfully! Now knows ${totalActivities} activities.`,
    stats: funAI.getStats(),
  });
}
