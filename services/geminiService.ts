import { GoogleGenAI } from "@google/genai";
import { AIAdviceRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGoalAdvice = async (request: AIAdviceRequest): Promise<string> => {
  try {
    const prompt = `
      Sen profesyonel bir yaşam koçu ve planlama uzmanısın.
      Kullanıcının şu hedefine ulaşması için kısa, motive edici ve uygulanabilir 3 maddelik bir tavsiye listesi ver.
      Türkçe cevap ver. Samimi ve enerjik ol.

      Hedef: ${request.goalTitle}
      Mevcut Durum: ${request.current} ${request.unit}
      Hedeflenen: ${request.target} ${request.unit}
      Yıl: 2026 (Bu hedefe 2026'ya kadar veya 2026 içinde ulaşılmak isteniyor).
      
      Çıktı formatı sadece düz metin olsun, markdown kullanabilirsin.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Şu an tavsiye oluşturulamıyor, lütfen kendi planına sadık kal!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bağlantı hatası. Lütfen internetini kontrol et veya daha sonra tekrar dene.";
  }
};