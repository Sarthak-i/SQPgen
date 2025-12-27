
import { GoogleGenAI, Type } from "@google/genai";
import { PaperConfig, QuestionPaper } from "../types";

export const generatePaper = async (config: PaperConfig): Promise<QuestionPaper> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a ${config.type} question paper for:
    - Class: ${config.classLevel}
    - Region/Country: ${config.region}
    - Difficulty Level: ${config.difficulty}/5
    - Topics: ${config.topics}
    - Number of Questions: ${config.questionCount}
    - Total Marks: ${config.totalMarks}
    - Time Duration: ${config.duration} minutes

    CRITICAL RULES:
    1. For every question, the "type" field MUST be exactly either "mcq" or "subjective" (lowercase).
    2. If type is "mcq", you MUST provide an "options" array with exactly 4 distinct strings.
    3. If type is "mcq", the options should be listed clearly.
    4. If type is "mcq", you MUST provide a "correctAnswer" which is exactly one of: "A", "B", "C", "D".
    5. If type is "subjective", "options" should be an empty array [] and "modelAnswer" MUST be provided.
    6. Ensure the sum of "marks" for all questions equals exactly ${config.totalMarks}.
    7. Ensure the questions follow the curriculum and standard of ${config.region}.
    
    Return ONLY a valid JSON object matching the requested schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          instructions: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                marks: { type: Type.NUMBER },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      type: { 
                        type: Type.STRING,
                        description: "Must be exactly 'mcq' or 'subjective'"
                      },
                      marks: { type: Type.NUMBER },
                      options: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Exactly 4 strings if type is 'mcq'."
                      },
                      correctAnswer: { 
                        type: Type.STRING,
                        description: "A, B, C, or D for mcq types."
                      },
                      modelAnswer: { 
                        type: Type.STRING,
                        description: "Detailed answer for subjective types."
                      }
                    },
                    required: ["id", "text", "type", "marks", "options"],
                    propertyOrdering: ["id", "text", "type", "marks", "options", "correctAnswer", "modelAnswer"]
                  }
                }
              },
              required: ["name", "marks", "questions"],
              propertyOrdering: ["name", "marks", "questions"]
            }
          }
        },
        required: ["title", "instructions", "sections"],
        propertyOrdering: ["title", "instructions", "sections"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    const parsed = JSON.parse(text);
    return parsed as QuestionPaper;
  } catch (err) {
    console.error("Failed to parse AI response", text);
    throw new Error("Invalid paper format received from AI");
  }
};
