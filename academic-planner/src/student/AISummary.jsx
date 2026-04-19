import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const apiKey = "AIzaSyAGV4Z6iufFnewAnwwwQ43E2GXdlXvkI8Y";
const genAI = new GoogleGenAI({ apiKey: apiKey });

export default function AISummary({ topicName }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAIContent = async () => {
    if (!prompt && !topicName) return;
    setLoading(true);

    try {
      const fullPrompt = `You are a concise academic tutor for a B.Tech CS student.
      Rules: Be brief. Max 120 words. Use bullet points. No long intros or conclusions. No filler phrases.
      Topic: ${topicName}.
      Question: ${prompt || "Give a short summary and 3-5 key exam points."}`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullPrompt
      });
      setResponse(result.text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error?.message?.includes("429")) {
        setResponse("⚠️ API quota exceeded. Please generate a new API key at aistudio.google.com/apikey and update your .env file.");
      } else {
        setResponse(`Error: ${error?.message || JSON.stringify(error)}`);
      }
    }
    setLoading(false);
  };

  const markdownComponents = {
    h1: ({ children }) => <h1 className="text-xl font-bold text-indigo-300 mt-4 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold text-indigo-300 mt-4 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-semibold text-indigo-400 mt-3 mb-1">{children}</h3>,
    h4: ({ children }) => <h4 className="text-sm font-semibold text-indigo-400 mt-2 mb-1">{children}</h4>,
    p: ({ children }) => <p className="text-slate-200 text-sm leading-relaxed mb-3">{children}</p>,
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc list-inside text-slate-200 text-sm space-y-1 mb-3 pl-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside text-slate-200 text-sm space-y-1 mb-3 pl-2">{children}</ol>,
    li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
    code: ({ inline, children }) =>
      inline ? (
        <code className="bg-slate-800 text-indigo-300 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>
      ) : (
        <code className="block bg-slate-900 text-green-300 text-xs p-4 rounded-xl font-mono overflow-x-auto mb-3 border border-white/10">
          {children}
        </code>
      ),
    pre: ({ children }) => <pre className="bg-slate-900 rounded-xl border border-white/10 mb-3 overflow-x-auto">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 text-sm mb-3">{children}</blockquote>
    ),
    hr: () => <hr className="border-white/10 my-4" />,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 transition-colors">
        {children}
      </a>
    ),
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
        ) : response ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {response}
          </ReactMarkdown>
        ) : (
          <p className="text-slate-400 italic">
            I'm ready! Ask me anything about {topicName} or click the button for a general summary.
          </p>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateAIContent()}
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