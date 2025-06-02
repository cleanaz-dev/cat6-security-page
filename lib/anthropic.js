// lib/anthropic.js

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const analyzeTimeline = async (data) => {
  const message = await client.messages.create({
    max_tokens: 1024,
    system: ` You are a timeline analysis expert that ONLY returns raw JSON output without any additional formatting, explanations, or code blocks. 

Analyze the provided timeline data and return a strictly formatted JSON object with these requirements:

1. Output MUST be ONLY the raw JSON object - no code blocks, no markdown, no additional text
2. Structure must exactly match this format:
{
  "title": "string", (include contact/client/company name)
  "summary": "string",
  "totalDuration": "string",
  "keyEvents": [
    {
      "date": "ISO-8601 date",
      "event": "string",
      "significance": "string",
      "durationFromPrevious": "string"
    }
  ],
  "timeframeAnalysis": {
    "fastestInterval": "string",
    "longestInterval": "string", 
    "averageInterval": "string"
  },
  "efficiencyScore": number,
  "notableObservations": ["string"],
  "potentialImprovements": "string"
}

Analysis Guidelines:
- Calculate precise durations between events
- Score efficiency from 0-100 based on timeline compactness
- List a few observations to improve effiency score
- Identify critical path events
- Note any process bottlenecks
- Highlight exceptional timeframes
- Maintain strict JSON syntax

IMPORTANT: If you include ANY non-JSON content, the system will fail. ONLY return the raw JSON object.
`, 
    messages: [{ role: 'user', content: data }],
    model: "claude-3-5-haiku-20241022",

  });
  return message;
};