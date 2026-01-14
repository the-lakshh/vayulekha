
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function interpretDrawing(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1], // Remove prefix
            },
          },
          {
            text: "This drawing was made with hand gestures in the air by someone expressing themselves freely. Look at the strokes and colors. Please provide a poetic, 1-sentence title or positive affirmation for this artwork. Keep it very simple and encouraging."
          }
        ]
      },
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "A beautiful breath of expression.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A dance of colors in the air.";
  }
}
