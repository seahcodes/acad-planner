import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, Send, Loader2 } from "lucide-react";

// Get API Key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY;

// Initialize only if API key exists
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("⚠️ Google Generative AI key not found in environment variables");
}

export default function AISummary({ topicName }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAIContent = async () => {
    // Validation checks
    if (!apiKey) {
      setResponse("❌ API Key not configured. Add your key to .env.local:\nVITE_GOOGLE_GENERATIVE_AI_KEY=your_key");
      return;
    }
    
    if (!genAI) {
      setResponse("❌ AI not initialized. Please restart the app and try again.");
      return;
    }
    
    if (!prompt && !topicName) return;
    setLoading(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // We context-wrap the student's question to keep it academic
      const fullPrompt = `You are an expert academic tutor for a B.Tech Computer Science student. 
      The current topic is: ${topicName}. 
      Student asks: ${prompt || "Give me a high-level summary and key points for my exam."}`;

      const result = await model.generateContent(fullPrompt);
      setResponse(result.response.text());
    } catch (error) {
      console.error("AI Error:", error);
      setResponse(`❌ Error: ${error.message || "Could not reach the AI. Check your API key and internet connection."}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6 mb-8">
      <div className="flex items-center gap-2 mb-4 text-indigo-400">
        <Sparkles size={20} />
        <h3 className="font-bold uppercase tracking-widest text-xs">AI Academic Assistant</h3>
      </div>

      {/* Response Area */}
      <div className="min-h-[100px] text-slate-200 text-sm leading-relaxed mb-6">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 italic">
            <Loader2 className="animate-spin" size={16} /> AI is thinking...
          </div>
        ) : (
          response || `I'm ready! Ask me anything about ${topicName} or click the button for a general summary.`
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Ask about ${topicName}...`}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button 
          onClick={generateAIContent}
          disabled={loading}
          className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}