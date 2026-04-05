
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, ideally proxy this through backend to hide API KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';

export const getMotivationalQuote = async (userContext: string): Promise<string> => {
  try {
    const prompt = `
      Sen professional psixolog va murabbiysan. Foydalanuvchi ma'lumotlari: ${userContext}.
      O'zbek tilida qisqa, kuchli va ilhomlantiruvchi maslahat yoki iqtibos (quote) yoz.
      Juda rasmiy bo'lma, samimiy bo'l. Maksimum 2 gap.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Bugun ajoyib kun, olg'a!";
  } catch (error) {
    // Sanitize log: Do not dump the entire error object which might contain headers/keys
    console.error("Gemini API Error:", error instanceof Error ? error.message : "Unknown error");
    return "Muvaffaqiyat - bu kichik harakatlarning yig'indisi. Davom eting!";
  }
};

export const generateHabitPlan = async (goal: string): Promise<{ title: string; category: string; frequency: string }[]> => {
  try {
    const prompt = `
      Foydalanuvchi maqsadi: "${goal}".
      Ushbu maqsadga erishish uchun 3 ta aniq va o'lchasa bo'ladigan odat (habit) ro'yxatini JSON formatida tuzib ber.
      Faqat JSON array qaytar.
      Format:
      [
        { "title": "Odat nomi", "category": "Ish" | "O'qish" | "Salomatlik" | "Shaxsiy", "frequency": "Har kuni" | "Haftalik" }
      ]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return [];
    // JSON qatorini tozalash (ba'zan markdown code block ichida kelishi mumkin)
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Plan Error:", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
};

export const chatWithAI = async (message: string, history: string[]): Promise<string> => {
  try {
    const prompt = `
      Sen habits.uz platformasining aqlli yordamchisisan. 
      Suhbat tarixi: 
      ${history.join('\n')}
      
      Foydalanuvchi savoli: ${message}
      
      Vazifang: Foydalanuvchiga odatlarni shakllantirish, vaqtni boshqarish va motivatsiya bo'yicha qisqa, aniq va foydali maslahat berish. O'zbek tilida javob ber.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Uzr, hozir javob bera olmayman.";
  } catch (error) {
    console.error("Gemini Chat Error:", error instanceof Error ? error.message : "Unknown error");
    return "Tizimda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.";
  }
};
