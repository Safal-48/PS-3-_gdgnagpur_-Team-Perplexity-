import { NextRequest, NextResponse } from 'next/server';
import { genAI, isGeminiMock } from '../../../src/utils/gemini';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '28.6';
    const lon = searchParams.get('lon') || '77.2';

    if (isGeminiMock()) {
      return NextResponse.json({
        temp: 24,
        condition: 'Partly Cloudy',
        humidity: 72,
        wind: 14,
        pressure: 1013,
        uvIndex: 8,
        rainProb: 40,
        hourly: [
          { hour: 'Now', temp: 24, rain: 20, icon: 'partly-cloudy' },
          { hour: '17:00', temp: 26, rain: 10, icon: 'sunny' },
          { hour: '18:00', temp: 25, rain: 15, icon: 'partly-cloudy' },
          { hour: '19:00', temp: 23, rain: 40, icon: 'rainy' },
          { hour: '20:00', temp: 21, rain: 65, icon: 'rainy' },
          { hour: '21:00', temp: 20, rain: 75, icon: 'thunderstorm' },
          { hour: '22:00', temp: 19, rain: 55, icon: 'rainy' }
        ],
        advisories: [
          {
            title: 'Pause Irrigation — Rain Expected Tonight (Mock)',
            desc: `Heavy rain forecast starting 20:00 tonight at coordinates (${lat}, ${lon}). Suspend active watering cycles.`,
            priority: 'urgent'
          },
          {
            title: 'Spray copper fungicide on Zone A before 17:00 (Mock)',
            desc: 'Complete treatments before humidity and wind rates rise.',
            priority: 'urgent'
          }
        ]
      });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `Generate a realistic agricultural weather forecast JSON report. The location coordinates are latitude: ${lat}, longitude: ${lon}. 
Generate weather statistics and agricultural advisories tailored to this specific location.
Include: current temp, humidity, wind, pressure, uvIndex, rainProb, and a list of 2 AI advisories for a crop farmer.
Response must be a raw JSON object containing these keys:
{
  "temp": number,
  "condition": "Sunny" | "Partly Cloudy" | "Rainy" | "Thunderstorm" | "Foggy",
  "humidity": number,
  "wind": number,
  "pressure": number,
  "uvIndex": number,
  "rainProb": number,
  "advisories": [
    { "title": "...", "desc": "...", "priority": "urgent" | "normal" | "good" }
  ]
}
Only output the JSON object without code ticks.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJsonText = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const parsedData = JSON.parse(cleanJsonText);

    // Merge in default hourly block structure
    parsedData.hourly = [
      { hour: 'Now', temp: parsedData.temp, rain: Math.round(parsedData.rainProb * 0.5), icon: 'partly-cloudy' },
      { hour: '17:00', temp: parsedData.temp + 1, rain: Math.round(parsedData.rainProb * 0.3), icon: 'sunny' },
      { hour: '18:00', temp: parsedData.temp, rain: Math.round(parsedData.rainProb * 0.4), icon: 'partly-cloudy' },
      { hour: '19:00', temp: parsedData.temp - 1, rain: parsedData.rainProb, icon: 'rainy' },
      { hour: '20:00', temp: parsedData.temp - 3, rain: Math.min(100, parsedData.rainProb + 20), icon: 'rainy' },
      { hour: '21:00', temp: parsedData.temp - 4, rain: Math.min(100, parsedData.rainProb + 30), icon: 'thunderstorm' }
    ];

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Weather API Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch weather insights',
      details: error.message || error,
      temp: 22,
      condition: 'Rainy',
      humidity: 80,
      wind: 16,
      pressure: 1011,
      uvIndex: 4,
      rainProb: 85,
      advisories: [
        { title: 'Rain warning fallback', desc: 'Precipitation expected. Suspend watering.', priority: 'urgent' }
      ],
      hourly: [
        { hour: 'Now', temp: 22, rain: 85, icon: 'rainy' }
      ]
    }, { status: 200 });
  }
}
