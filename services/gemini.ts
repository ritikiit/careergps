import { GoogleGenAI } from "@google/genai";
import { CareerInputs, CareerGPSResponse } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private client: GoogleGenAI;

  constructor() {
    // Ideally this comes from environment variables, but sticking to prompt rules strictly.
    // The user instruction says to use process.env.API_KEY.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY not found in environment variables.");
    }
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async generateCareerPlan(inputs: CareerInputs): Promise<CareerGPSResponse> {
    if (!process.env.API_KEY) {
        throw new Error("Missing API Key. Please configure process.env.API_KEY.");
    }

    const userPrompt = `
      1. Current role OR current degree/status: ${inputs.currentRole}
      2. Total years of experience: ${inputs.yearsExperience}
      3. Current or target industry: ${inputs.industry}
      4. Desired future role OR career direction: ${inputs.desiredRole}
      5. Time horizon: ${inputs.timeHorizon}
    `;

    try {
      // Updated to use a valid model for complex tasks.
      // 'gemini-3-pro-preview' is recommended for complex reasoning/text tasks.
      const response = await this.client.models.generateContent({
        model: 'gemini-3-pro-preview', 
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json'
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: userPrompt }]
            }
        ]
      });

      const responseText = response.text;
      
      if (!responseText) {
        throw new Error("No response received from Gemini.");
      }

      // Parse JSON. The model is instructed to return JSON, but sometimes wraps in markdown.
      // The responseMimeType config helps, but we add safety.
      let jsonString = responseText.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```/, '').replace(/```$/, '');
      }

      const data = JSON.parse(jsonString) as CareerGPSResponse;
      return data;

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let friendlyMessage = "Failed to generate career plan. Please try again.";
      
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        friendlyMessage = "Model unavailable (404). This usually means the API key doesn't have access to the selected model or the model name is deprecated.";
      } else if (error.message?.includes("401") || error.message?.includes("403")) {
         friendlyMessage = "Authentication failed. Please check your API key.";
      } else if (error.message?.includes("503")) {
          friendlyMessage = "Service temporarily unavailable. Please try again in a moment.";
      }

      throw new Error(friendlyMessage);
    }
  }
}

export const geminiService = new GeminiService();