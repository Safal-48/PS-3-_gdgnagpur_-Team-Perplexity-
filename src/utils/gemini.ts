import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'mock-api-key';

// Initialize the Google Generative AI SDK
export const genAI = new GoogleGenerativeAI(apiKey);

// Helper to determine if the Gemini integration is in sandbox/mock mode
export const isGeminiMock = () => {
  return !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-api-key-placeholder-for-ai-chat-and-disease-vision' || process.env.GEMINI_API_KEY === 'mock-api-key';
};
