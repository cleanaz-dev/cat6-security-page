// API Route (/api/ai/analyze-timeline)
import { analyzeTimeline } from "@/lib/anthropic";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { activities } = await request.json();
    
    if (!activities) {
      return NextResponse.json(
        { error: "Activities data is required" },
        { status: 400 }
      );
    }

    const aiResponse = await analyzeTimeline(JSON.stringify(activities));
    
    // Extract the JSON content from the AI response
    const analysisData = aiResponse.content[0].text;
    
    return NextResponse.json({ 
      success: true,
      analysis: JSON.parse(analysisData) // Parse the JSON string
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}