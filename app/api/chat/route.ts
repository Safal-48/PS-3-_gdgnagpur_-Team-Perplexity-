import { NextResponse } from 'next/server';
import { genAI, isGeminiMock } from '../../../src/utils/gemini';

export async function POST(req: Request) {
  try {
    const { messages, message } = await req.json();
    const query = message || (messages && messages[messages.length - 1]?.content) || '';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check if key is placeholder / mock
    if (isGeminiMock()) {
      return NextResponse.json({
        content: getMockAIResponse(query),
        timestamp: new Date().toISOString()
      });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are KrishiMitra AI, a premium nature-inspired agricultural dashboard co-pilot. Keep responses structured, professional, friendly, and formatted using clean markdown list details. Always provide companion planting recommendations or organic remedies when asked about crop issues.'
    });

    const result = await model.generateContent(query);
    const text = result.response.text();

    return NextResponse.json({
      content: text,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    return NextResponse.json({
      error: 'Failed to process AI response',
      details: error.message || error
    }, { status: 500 });
  }
}

// Fallback Mock System
function getMockAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('spot') || q.includes('blight') || q.includes('disease') || q.includes('brown')) {
    return "🍃 **Tomato Late Blight Analysis (Gemini Mock)**\n\nThe brown spots with yellow halos represent **Phytophthora infestans** (Late Blight).\n\n**Immediate Actions:**\n• Prune all infected foliage and bag them\n• Apply **copper-based fungicide** spray\n• Stop overhead irrigation — switch to drip at soil level\n\n⚠️ Severity: Medium. Act within 48 hours to prevent spread.";
  }
  if (q.includes('irrig') || q.includes('water') || q.includes('drip') || q.includes('moisture')) {
    return "💧 **Zone 3 Corn Irrigation Schedule — Monsoon Season (Gemini Mock)**\n\nGiven current soil moisture at 32%:\n• Monday 06:00 → 12 min drip cycle (Zone 3A)\n• Wednesday 06:00 → 8 min drip cycle\n• Friday → Skip if rain is detected\n\n📊 Estimated water savings: 340L per week.";
  }
  return "I've analyzed your farm telemetry data across all active sensor nodes. Based on the current soil moisture (42.8%), solar intensity (680 W/m²), and crop health index of 94.2, your Zone 1 crops are performing well. Let me know if you'd like to optimize irrigation or soil nutrients.";
}
