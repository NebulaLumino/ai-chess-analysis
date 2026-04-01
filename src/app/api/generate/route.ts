import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { timeControl, skillLevel, openingPreference, focusArea } = await req.json();
    const prompt = `You are a chess grandmaster and coach. Provide a comprehensive chess training plan:
- **Time Control:** ${timeControl}
- **Skill Level:** ${skillLevel}
- **Opening Preference:** ${openingPreference}
- **Focus Area:** ${focusArea}

Include: 1) Opening Repertoire Recommendations, 2) Middlegame Strategy Drills, 3) Endgame Technique Training, 4) Time Management Tips for ${timeControl}, 5) Game Analysis Checklist, 6) Daily Practice Routine, 7) Recommended Resources.`;
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-chat", messages: [
        { role: "system", content: "You are a chess grandmaster and elite chess coach." },
        { role: "user", content: prompt }
      ], temperature: 0.8, max_tokens: 2000 }),
    });
    if (!response.ok) return NextResponse.json({ error: await response.text() }, { status: response.status });
    const data = await response.json();
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || "No response." });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
