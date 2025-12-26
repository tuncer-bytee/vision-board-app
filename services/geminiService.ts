import { GoogleGenAI } from "@google/genai";
import { AIAdviceRequest } from "../types";

/**
 * Generates AI advice for a goal using the Gemini 3 Flash model.
 */
export const getGoalAdvice = async (request: AIAdviceRequest): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Hedefim: ${request.goalTitle}. 
Mevcut ilerlemem: ${request.current} ${request.unit}. 
Hedeflenen değer: ${request.target} ${request.unit}. 

Lütfen bu hedefe ulaşmam için 3 tane somut ve motive edici tavsiye ver. 
Yanıtın Türkçe olsun ve nazik bir dil kullan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Şu an için tavsiye oluşturulamadı. Lütfen hedeflerinize odaklanmaya devam edin!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tavsiye alınırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
  }
};
