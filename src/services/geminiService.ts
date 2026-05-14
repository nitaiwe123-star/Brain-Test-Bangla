import { GoogleGenAI, Type } from "@google/genai";
import { Puzzle, INITIAL_PUZZLES } from "../data/puzzles";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
    return null;
  }
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}

const puzzleSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: "The puzzle question in Bengali." },
    options: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Exactly 4 options in Bengali."
    },
    answerIndex: { type: Type.NUMBER, description: "The 0-based index of the correct answer." },
    hint: { type: Type.STRING, description: "A helpful hint in Bengali." },
    category: { 
      type: Type.STRING, 
      enum: ["Riddle", "Math", "Logical", "IQ", "General"],
      description: "The category of the puzzle."
    },
    explanation: { type: Type.STRING, description: "A detailed explanation of the solution in Bengali." }
  },
  required: ["question", "options", "answerIndex", "hint", "category", "explanation"]
};

export async function generatePuzzle(level: number): Promise<Puzzle> {
  // Use static puzzles for the first few levels to ensure a solid start
  if (level <= INITIAL_PUZZLES.length) {
    return { ...INITIAL_PUZZLES[level - 1], id: level };
  }

  const ai = getAI();
  if (!ai) {
    console.log("No AI configured, falling back to static puzzles.");
    const fallback = INITIAL_PUZZLES[level % INITIAL_PUZZLES.length];
    return { ...fallback, id: level };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a unique and interesting ${level % 2 === 0 ? 'riddle' : 'math or logical'} puzzle in Bengali for a brain test game. 
      This is for level ${level}. 
      Make sure the question is in natural Bengali and challenging but fun.
      Avoid repeating common puzzles.
      Provide a clear explanation in Bengali.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: puzzleSchema,
      },
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: level
    };
  } catch (error) {
    console.error("Error generating puzzle:", error);
    // Fallback to cycling if AI fails
    const fallback = INITIAL_PUZZLES[level % INITIAL_PUZZLES.length];
    return { ...fallback, id: level };
  }
}
