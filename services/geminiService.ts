import { GoogleGenAI, Schema } from "@google/genai";
import { PROMPT_GENERATE_DB, PROMPT_ADVISOR_SYSTEM, PROMPT_UI_COPY, FALLBACK_DB, FALLBACK_UI } from "../constants";
import { AdvisorResponse, FoodDatabase, SelectedMenu, UICopy, UserProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper function to extract JSON from response text safely
function extractJSON<T>(text: string): T | null {
  try {
    // Attempt to parse directly
    return JSON.parse(text) as T;
  } catch (e) {
    // If markdown code block is present, strip it
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch (e2) {
        console.error("Failed to parse extracted JSON", e2);
        return null;
      }
    }
    console.error("Failed to parse JSON directly", e);
    return null;
  }
}

export const generateFoodDatabase = async (): Promise<FoodDatabase> => {
  if (!ai) {
    console.warn("API Key missing, using fallback DB");
    return FALLBACK_DB;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PROMPT_GENERATE_DB,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const data = extractJSON<FoodDatabase>(response.text);
    return data || FALLBACK_DB;
  } catch (error) {
    console.error("Error generating food DB:", error);
    return FALLBACK_DB;
  }
};

export const analyzeMenu = async (
  profile: UserProfile, 
  menu: SelectedMenu, 
  alternatives: FoodDatabase
): Promise<AdvisorResponse | null> => {
  if (!ai) return null;

  const candidateDrinks = alternatives.categories.drink.slice(0, 5); // Limit context size
  const candidateMains = alternatives.categories.main_dish.slice(0, 5);

  const payload = {
    user_profile: profile,
    selected_menu: {
      main_dish: menu.main_dish,
      snack: menu.snack,
      drink: menu.drink,
    },
    candidate_alternatives: {
      main_dish: candidateMains,
      drink: candidateDrinks
    }
  };

  const userPrompt = JSON.stringify(payload);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: PROMPT_ADVISOR_SYSTEM }] }, // Send system prompt as user message if needed, or better use systemInstruction in config
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        systemInstruction: PROMPT_ADVISOR_SYSTEM,
      },
    });

    return extractJSON<AdvisorResponse>(response.text);
  } catch (error) {
    console.error("Error analyzing menu:", error);
    return null;
  }
};

export const generateUICopy = async (): Promise<UICopy> => {
  if (!ai) return FALLBACK_UI;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate UI copy based on system prompt instructions.",
      config: {
        responseMimeType: "application/json",
        systemInstruction: PROMPT_UI_COPY,
      },
    });

    const data = extractJSON<UICopy>(response.text);
    return data || FALLBACK_UI;
  } catch (error) {
    console.error("Error generating UI copy:", error);
    return FALLBACK_UI;
  }
};