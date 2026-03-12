import { NextRequest, NextResponse } from "next/server";
import { buildKnowledgeBase } from "@/lib/knowledge-base";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL          = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const KNOWLEDGE_BASE = buildKnowledgeBase();

const SYSTEM_PROMPT = `You are AgriBot (এগ্রিবট), an expert agricultural AI assistant embedded in AgriSense — a smart crop recommendation platform built for Bangladeshi and South Asian farmers.

LANGUAGE RULE — VERY IMPORTANT:
- If the user writes in Bengali/Bangla (বাংলা), YOU MUST reply entirely in Bengali.
- If the user writes in English, reply in English.
- If the user mixes both languages, match their mix — lead in the language they used most.
- Never refuse to reply in Bengali. Bengali farmers are your primary users.

YOUR EXPERTISE (from the AgriSense knowledge base below):
- All 26 crops supported by the platform: rice (ধান), jute (পাট), maize (ভুট্টা), mango (আম), banana (কলা), cauliflower (ফুলকপি), chili (মরিচ), cucumber (শসা), and more.
- Ideal N, P, K, pH, EC, temperature and humidity ranges for each crop.
- Soil health analysis: when to add lime, urea, TSP, MOP, compost.
- Fertilizer dosing: organic and chemical, timing and method.
- Pest and disease identification and management.
- Irrigation scheduling and deficit/excess water signals.
- Seasonal planting calendar for Bangladesh (Kharif, Rabi, Boro).
- Interpreting live sensor data: N, P, K, pH, EC, temperature, humidity, light intensity, air pressure.

COMMUNICATION STYLE:
- Be concise, practical, and farmer-friendly. Avoid academic jargon.
- When given sensor values, interpret them directly: e.g. "আপনার নাইট্রোজেন ৪৫ kg/ha — ধানের জন্য কম। ইউরিয়া সার দিন।"
- Use simple numbered steps for action items.
- Keep responses focused — not too long; give actionable advice a smallholder can act on today.
- When discussing crops, always mention both English and Bengali names, e.g. "rice (ধান)".

${KNOWLEDGE_BASE}

When a user provides sensor/soil readings, compare them against the ideal ranges above and give specific corrective advice. Always prioritize actionable, low-cost solutions accessible to smallholder farmers.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === "YOUR_NEW_KEY_HERE") {
    return NextResponse.json(
      { error: "OpenRouter API key is not configured. Add OPENROUTER_API_KEY to .env.local" },
      { status: 503 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  // Basic input sanitisation — strip messages that are too long
  const sanitised = messages.map((m) => ({
    role:    m.role    === "user" || m.role === "assistant" ? m.role : "user",
    content: typeof m.content === "string" ? m.content.slice(0, 4000) : "",
  }));

  try {
    const response = await fetch(OPENROUTER_URL, {
      method:  "POST",
      headers: {
        "Authorization":    `Bearer ${apiKey}`,
        "Content-Type":     "application/json",
        "HTTP-Referer":     "https://agrisense.app",
        "X-OpenRouter-Title": "AgriSense",
      },
      body: JSON.stringify({
        model:    MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitised,
        ],
        max_tokens:   1200,
        temperature:  0.65,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", response.status, err);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "No response from AI.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Failed to reach AI service." }, { status: 502 });
  }
}
