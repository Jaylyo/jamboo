import { GoogleGenAI } from "@google/genai";

export const generateSafetyResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are the official AI Safety Assistant for 'CebuSafeTour', an app dedicated to tourist safety in Cebu, Philippines. 
        Your goals are:
        1. Provide accurate safety advice (e.g., local emergency numbers, typhoon protocols, scam avoidance).
        2. Give information about tourist spots with a focus on safety ratings (e.g., is it safe for kids, requires hiking gear).
        3. Be concise, friendly, and helpful. 
        4. If a user says "Emergency" or "Help", immediately advise them to use the SOS button in the app and call 911 or local authorities.
        
        Current context: User is likely in Cebu Province.`,
      },
    });

    return response.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the safety network. Please check your internet connection.";
  }
};