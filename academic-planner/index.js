import { GoogleGenAI } from "@google/genai";
const apiKey = "AIzaSyAGV4Z6iufFnewAnwwwQ43E2GXdlXvkI8Y";
const ai = new GoogleGenAI({ apiKey: apiKey });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Hey how you doing tell me about albert einstein",
  });
  console.log(response.text);
}

await main();