import { NextResponse } from 'next/server';
import { genAI, isGeminiMock } from '../../../src/utils/gemini';

export async function POST(req: Request) {
  try {
    const { messages, message, lang } = await req.json();
    const query = message || (messages && messages[messages.length - 1]?.content) || '';
    const activeLang = lang || 'en'; // default to english

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check if key is placeholder / mock
    if (isGeminiMock()) {
      return NextResponse.json({
        content: getMockAIResponse(query, activeLang),
        timestamp: new Date().toISOString()
      });
    }

    let languageDirective = 'You must respond ONLY in English language.';
    if (activeLang === 'hi') {
      languageDirective = 'You must respond ONLY in Hindi language (हिंदी भाषा / देवनागरी लिपि).';
    } else if (activeLang === 'mr') {
      languageDirective = 'You must respond ONLY in Marathi language (मराठी भाषा / देवनागरी लिपि).';
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are KrishiMitra AI, a premium nature-inspired agricultural dashboard co-pilot. Keep responses structured, professional, friendly, and formatted using clean markdown list details. Always provide companion planting recommendations or organic remedies when asked about crop issues. ${languageDirective}`
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
function getMockAIResponse(query: string, lang: string): string {
  const q = query.toLowerCase();
  
  if (lang === 'hi') {
    if (q.includes('spot') || q.includes('blight') || q.includes('disease') || q.includes('brown')) {
      return "🍃 **टमाटर लेट ब्लाइट विश्लेषण (कृषिमित्र मॉक)**\n\nपीले प्रभामंडल वाले भूरे धब्बे **फाइटोफ्थोरा इन्फेस्टन्स** (लेट ब्लाइट) को दर्शाते हैं।\n\n**तत्काल कार्रवाई:**\n• सभी संक्रमित पत्तियों को छांटें और उन्हें नष्ट करें\n• **तांबा आधारित कवकनाशी** स्प्रे लगाएं\n• सिंचाई बंद करें — ड्रिप सिंचाई का उपयोग करें\n\n⚠️ गंभीरता: मध्यम। प्रसार को रोकने के लिए 48 घंटे के भीतर कार्रवाई करें।";
    }
    if (q.includes('irrig') || q.includes('water') || q.includes('drip') || q.includes('moisture')) {
      return "💧 **जोन 3 मक्का सिंचाई अनुसूची (कृषिमित्र मॉक)**\n\nवर्तमान मिट्टी की नमी 32% को देखते हुए:\n• सोमवार 06:00 → 12 मिनट ड्रिप चक्र\n• बुधवार 06:00 → 8 मिनट ड्रिप चक्र\n• शुक्रवार → वर्षा होने पर बंद करें\n\n📊 अनुमानित पानी की बचत: 340 लीटर प्रति सप्ताह।";
    }
    return "नमस्ते! मैंने आपके सभी सक्रिय सेंसर नोड्स का विश्लेषण किया है। वर्तमान मिट्टी की नमी (42.8%) और फसल स्वास्थ्य सूचकांक (94.2) को देखते हुए, आपकी फसलें अच्छी स्थिति में हैं। आप मुझसे कोई भी कृषि प्रश्न पूछ सकते हैं।";
  }
  
  if (lang === 'mr') {
    if (q.includes('spot') || q.includes('blight') || q.includes('disease') || q.includes('brown')) {
      return "🍃 **टोमॅटो लेट ब्लाइट विश्लेषण (कृषिमित्र मॉक)**\n\nपिवळे डाग आणि तपकिरी ठिपके **फायटोफ्थोरा इन्फेस्टन्स** (लेट ब्लाइट) दर्शवतात.\n\n**तात्काळ उपाय:**\n• सर्व संक्रमित पाने छाटून टाका आणि नष्ट करा\n• **तांबे-आधारित बुरशीनाशक** फवारणी करा\n• ठिबक सिंचन पद्धतीचा वापर करा\n\n⚠️ धोका: मध्यम. रोग प्रसार रोखण्यासाठी ४८ तासांत कारवाई करा.";
    }
    if (q.includes('irrig') || q.includes('water') || q.includes('drip') || q.includes('moisture')) {
      return "💧 **झोन ३ मका सिंचन वेळापत्रक (कृषिमित्र मॉक)**\n\nसध्याची मातीतील आर्द्रता ३२% पाहता:\n• सोमवार ०६:०० → १२ मिनिटे ठिबक सिंचन\n• बुधवार ०६:०० → ८ मिनिटे ठिबक सिंचन\n• शुक्रवार → पाऊस पडल्यास पाणी देणे थांबवा\n\n📊 अंदाजित पाण्याची बचत: ३४० लीटर प्रति आठवडा.";
    }
    return "नमस्कार! मी तुमच्या शेतातील सर्व सक्रिय सेन्सरचे विश्लेषण केले आहे. मातीची आर्द्रता (४२.८%) आणि पीक आरोग्य निर्देशांक (९४.२) उत्तम आहे. तुम्हाला शेतीबद्दल काही मदत हवी आहे का?";
  }

  // Default English
  if (q.includes('spot') || q.includes('blight') || q.includes('disease') || q.includes('brown')) {
    return "🍃 **Tomato Late Blight Analysis (Gemini Mock)**\n\nThe brown spots with yellow halos represent **Phytophthora infestans** (Late Blight).\n\n**Immediate Actions:**\n• Prune all infected foliage and bag them\n• Apply **copper-based fungicide** spray\n• Stop overhead irrigation — switch to drip at soil level\n\n⚠️ Severity: Medium. Act within 48 hours to prevent spread.";
  }
  if (q.includes('irrig') || q.includes('water') || q.includes('drip') || q.includes('moisture')) {
    return "💧 **Zone 3 Corn Irrigation Schedule — Monsoon Season (Gemini Mock)**\n\nGiven current soil moisture at 32%:\n• Monday 06:00 → 12 min drip cycle (Zone 3A)\n• Wednesday 06:00 → 8 min drip cycle\n• Friday → Skip if rain is detected\n\n📊 Estimated water savings: 340L per week.";
  }
  return "I've analyzed your farm telemetry data across all active sensor nodes. Based on the current soil moisture (42.8%), solar intensity (680 W/m²), and crop health index of 94.2, your Zone 1 crops are performing well. Let me know if you'd like to optimize irrigation or soil nutrients.";
}
