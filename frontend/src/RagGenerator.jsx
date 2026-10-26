import { useState } from "react";
import axios from "axios";

const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "X", "YouTube"];
const TONES = ["Friendly", "Professional", "Funny", "Inspirational", "Casual", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Long"];

const initialForm = { topic: "", platform: "Instagram", tone: "Friendly", audience: "General audience", keywords: "", length: "Medium" };

function Label({ children }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>;
}

function HashtagPill({ tag }) {
  return <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>;
}

export default function RagGenerator({ showToast }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:5000/rag/generate-caption", form);
      if (!res.data.success) throw new Error(res.data.error || "Generation failed.");
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to generate a RAG caption.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast?.(label);
    } catch {
      showToast?.("Copy failed.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-8 text-white">
        <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
          RAG Powered
        </span>
        <h2 className="text-2xl font-extrabold">Knowledge-Based Caption Generator</h2>
        <p className="mt-2 text-purple-100 text-sm max-w-xl">
          Generate personalized captions using relevant information retrieved from your uploaded knowledge base.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={generate} className="space-y-5">
            <div>
              <Label>Caption Topic *</Label>
              <textarea name="topic" value={form.topic} onChange={update} required rows={3}
                placeholder="e.g. Promote CaptionCraft AI to creators"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Platform</Label>
                <select name="platform" value={form.platform} onChange={update}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:outline-none">
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <Label>Tone</Label>
                <select name="tone" value={form.tone} onChange={update}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:outline-none">
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Target Audience</Label>
                <input name="audience" value={form.audience} onChange={update}
                  placeholder="Content creators"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none" />
              </div>
              <div>
                <Label>Length</Label>
                <select name="length" value={form.length} onChange={update}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:outline-none">
                  {LENGTHS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label>Keywords</Label>
              <input name="keywords" value={form.keywords} onChange={update}
                placeholder="personalized captions, engagement"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition shadow-md shadow-purple-200">
              {loading ? "Searching knowledge base..." : "✨ Generate RAG Caption"}
            </button>
          </form>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Generated Content</h3>

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
              <span className="text-5xl mb-4">🧠</span>
              <p className="text-sm">RAG-powered content will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-5xl animate-pulse mb-4">🤖</span>
              <p className="text-sm font-medium text-gray-600">Searching knowledge base and generating...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700">📝 Caption</span>
                  <button onClick={() => copy(result.caption, "Caption copied!")}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition">
                    📋 Copy
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {result.caption}
                </div>
              </div>

              {result.alternatives?.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">💡 Alternatives</p>
                  <div className="space-y-2">
                    {result.alternatives.map((c, i) => (
                      <div key={i} className="flex gap-3 items-start border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition">
                        <span className="text-purple-500 font-bold text-sm">{i + 1}.</span>
                        <p className="flex-1 text-sm text-gray-700 whitespace-pre-wrap">{c}</p>
                        <button onClick={() => copy(c)} className="text-gray-400 hover:text-purple-600">📋</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.hashtags?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">#️⃣ Hashtags</span>
                    <button onClick={() => copy(result.hashtags.join(" "), "Hashtags copied!")}
                      className="text-xs font-semibold text-purple-600 border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition">
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">{result.hashtags.map((t, i) => <HashtagPill key={i} tag={t} />)}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {result.emojis?.length > 0 && (
                  <div className="border border-gray-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">😊 Emojis</p>
                    <p className="text-2xl tracking-widest">{result.emojis.join(" ")}</p>
                  </div>
                )}
                {result.call_to_action && (
                  <div className="border border-gray-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">🎯 Call to Action</p>
                    <p className="text-sm text-gray-700">{result.call_to_action}</p>
                  </div>
                )}
              </div>

              {/* RAG metadata */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <p className="text-sm font-bold text-emerald-800 mb-2">🔍 RAG Retrieval Details</p>
                <p className="text-xs text-gray-600 mb-3">Retrieved chunks: {result.rag_metadata?.retrieved_count ?? 0}</p>
                {result.rag_metadata?.sources?.length > 0 ? (
                  <div className="space-y-2">
                    {result.rag_metadata.sources.map((s, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 text-xs">
                        <p className="font-semibold text-gray-800">{s.document_name}</p>
                        <p className="text-gray-500 mt-0.5">Similarity: {Number(s.similarity).toFixed(3)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No relevant documents retrieved. Caption generated without knowledge base.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
