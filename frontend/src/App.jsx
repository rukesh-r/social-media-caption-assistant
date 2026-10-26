import { useState } from "react";
import axios from "axios";
import History from "./History.jsx";
import RagGenerator from "./RagGenerator";
import { supabase } from "./supabaseClient";

const TABS = ["Generate", "Rewrite", "Analyze", "RAG", "History"];

const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "X"];
const TONES = ["Casual", "Professional", "Funny", "Inspirational", "Exciting", "Promotional"];
const AUDIENCES = ["General", "College Students", "Professionals", "Entrepreneurs", "Customers", "Friends"];
const LENGTHS = ["Short", "Medium", "Long"];

function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-sm font-medium transition-all
      ${type === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>;
}

function Select({ name, value, onChange, options }) {
  return (
    <select name={name} value={value} onChange={onChange}
      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function LoadingState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <span className="text-5xl animate-pulse mb-4">🤖</span>
      <p className="text-sm font-medium text-gray-600">{text}</p>
    </div>
  );
}

function HashtagPill({ tag }) {
  return (
    <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
  );
}

function CopyButton({ onClick, label = "Copy" }) {
  return (
    <button onClick={onClick}
      className="text-xs font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition">
      📋 {label}
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Generate");
  const [toast, setToast] = useState(null);

  // Generate
  const [formData, setFormData] = useState({ topic: "", platform: "Instagram", tone: "Casual", audience: "General", keywords: "", length: "Medium" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Rewrite
  const [originalCaption, setOriginalCaption] = useState("");
  const [rewriteStyle, setRewriteStyle] = useState("Make More Engaging");
  const [rewritePlatform, setRewritePlatform] = useState("Instagram");
  const [rewriteResult, setRewriteResult] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Analyze
  const [analyzeCaptionText, setAnalyzeCaptionText] = useState("");
  const [analyzePlatform, setAnalyzePlatform] = useState("Instagram");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyText = async (text, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label);
    } catch {
      showToast("Copy failed.", "error");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      showToast("Please upload JPG, PNG or WEBP.", "error"); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image must be less than 10 MB.", "error"); return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const generateCaption = async () => {
    if (!formData.topic.trim() && !image) { showToast("Enter a topic or upload an image.", "error"); return; }
    setLoading(true); setResult(null);
    try {
      let response;
      if (image) {
        const data = new FormData();
        data.append("image", image);
        data.append("platform", formData.platform);
        data.append("tone", formData.tone);
        data.append("audience", formData.audience);
        data.append("length", formData.length);
        response = await axios.post("http://127.0.0.1:5000/generate-image-caption", data);
      } else {
        response = await axios.post("http://127.0.0.1:5000/generate-caption", formData);
      }
      if (response.data.success) setResult(response.data.result);
      else showToast(response.data.error, "error");
    } catch (err) {
      showToast(err.response?.data?.error || "Unable to generate caption.", "error");
    } finally { setLoading(false); }
  };

  const handleRewrite = async () => {
    if (!originalCaption.trim()) { showToast("Enter a caption to rewrite.", "error"); return; }
    setRewriteLoading(true); setRewriteResult(null);
    try {
      const response = await axios.post("http://127.0.0.1:5000/rewrite-caption", { caption: originalCaption, style: rewriteStyle, platform: rewritePlatform });
      if (response.data.success) setRewriteResult(response.data.result);
      else showToast(response.data.error, "error");
    } catch (err) {
      showToast(err.response?.data?.error || "Unable to rewrite caption.", "error");
    } finally { setRewriteLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!analyzeCaptionText.trim()) { showToast("Enter a caption to analyze.", "error"); return; }
    setAnalysisLoading(true); setAnalysisResult(null);
    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze-caption", { caption: analyzeCaptionText, platform: analyzePlatform });
      if (response.data.success) setAnalysisResult(response.data.result);
      else showToast(response.data.error, "error");
    } catch (err) {
      showToast(err.response?.data?.error || "Unable to analyze caption.", "error");
    } finally { setAnalysisLoading(false); }
  };

  const scoreColor = (s) => s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-red-500";
  const scoreRing = (s) => s >= 80 ? "ring-emerald-200" : s >= 60 ? "ring-amber-200" : "ring-red-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white text-lg">✨</div>
            <div>
              <span className="text-lg font-bold text-gray-900">CaptionCraft</span>
              <span className="text-lg font-bold text-purple-600"> AI</span>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition">
            Sign out
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">Generative AI</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Create Better<br />
          <span className="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">Social Media Content</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base">
          Generate, rewrite, analyze and personalize your captions with AI.
        </p>
      </section>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 pb-2">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${activeTab === tab ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── GENERATE TAB ── */}
        {activeTab === "Generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">✨ Generate Caption</h2>

              {/* Image upload */}
              <div className="mb-5">
                <Label>Upload Image <span className="text-gray-400 font-normal">(optional)</span></Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition">
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm text-gray-500">Click to upload · JPG, PNG, WEBP · Max 10 MB</span>
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {imagePreview && (
                <div className="mb-5 relative">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-52 object-cover rounded-2xl" />
                  <button onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">
                    Remove
                  </button>
                </div>
              )}

              <div className="mb-5">
                <Label>Post Topic</Label>
                <textarea name="topic" value={formData.topic} onChange={handleChange}
                  placeholder="e.g. College hackathon win 🏆"
                  rows={3}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div><Label>Platform</Label><Select name="platform" value={formData.platform} onChange={handleChange} options={PLATFORMS} /></div>
                <div><Label>Tone</Label><Select name="tone" value={formData.tone} onChange={handleChange} options={TONES} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div><Label>Audience</Label><Select name="audience" value={formData.audience} onChange={handleChange} options={AUDIENCES} /></div>
                <div><Label>Length</Label><Select name="length" value={formData.length} onChange={handleChange} options={LENGTHS} /></div>
              </div>

              <div className="mb-6">
                <Label>Keywords</Label>
                <input type="text" name="keywords" value={formData.keywords} onChange={handleChange}
                  placeholder="AI, innovation, teamwork"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none" />
              </div>

              <button onClick={generateCaption} disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition shadow-md shadow-purple-200">
                {loading ? "🤖 Generating..." : "✨ Generate Caption"}
              </button>
            </div>

            {/* OUTPUT */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Generated Content</h2>
              {!result && !loading && <EmptyState icon="✨" text="Your generated content will appear here." />}
              {loading && <LoadingState text="AI is crafting your caption..." />}
              {result && !loading && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">📝 Main Caption</span>
                      <CopyButton onClick={() => copyText(result.caption, "Caption copied!")} />
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-4 text-sm text-gray-800 leading-relaxed">
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
                            <p className="flex-1 text-sm text-gray-700">{c}</p>
                            <button onClick={() => copyText(c)} className="text-gray-400 hover:text-purple-600 text-base">📋</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.hashtags?.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700">#️⃣ Hashtags</span>
                        <CopyButton onClick={() => copyText(result.hashtags.join(" "), "Hashtags copied!")} label="Copy All" />
                      </div>
                      <div className="flex flex-wrap gap-2">{result.hashtags.map((t, i) => <HashtagPill key={i} tag={t} />)}</div>
                    </div>
                  )}

                  {result.call_to_action && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">🎯 Call to Action</p>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-gray-800">{result.call_to_action}</div>
                    </div>
                  )}

                  {result.emojis?.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">😊 Emojis</p>
                      <div className="text-2xl tracking-widest">{result.emojis.join(" ")}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REWRITE TAB ── */}
        {activeTab === "Rewrite" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-2 text-gray-900">✏️ Caption Rewriter</h2>
              <p className="text-sm text-gray-500 mb-6">Improve an existing caption using AI.</p>

              <div className="mb-5">
                <Label>Existing Caption</Label>
                <textarea value={originalCaption} onChange={e => setOriginalCaption(e.target.value)}
                  placeholder="Paste your existing caption here..."
                  rows={7}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Rewrite Style</Label>
                  <Select value={rewriteStyle} onChange={e => setRewriteStyle(e.target.value)}
                    options={["Make More Engaging", "Make Professional", "Make Funny", "Make Inspirational", "Make Shorter", "Add Emojis"]} />
                </div>
                <div>
                  <Label>Platform</Label>
                  <Select value={rewritePlatform} onChange={e => setRewritePlatform(e.target.value)} options={PLATFORMS} />
                </div>
              </div>

              <button onClick={handleRewrite} disabled={rewriteLoading}
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition">
                {rewriteLoading ? "🤖 Rewriting..." : "✏️ Rewrite Caption"}
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Rewritten Caption</h2>
              {!rewriteResult && !rewriteLoading && <EmptyState icon="✏️" text="Your rewritten caption will appear here." />}
              {rewriteLoading && <LoadingState text="AI is improving your caption..." />}
              {rewriteResult && !rewriteLoading && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">✨ Rewritten</span>
                      <CopyButton onClick={() => copyText(rewriteResult.rewritten_caption, "Caption copied!")} />
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-4 text-sm text-gray-800 leading-relaxed">
                      {rewriteResult.rewritten_caption}
                    </div>
                  </div>

                  {rewriteResult.alternative_versions?.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">💡 Alternative Versions</p>
                      <div className="space-y-2">
                        {rewriteResult.alternative_versions.map((v, i) => (
                          <div key={i} className="border border-gray-100 rounded-xl p-3 text-sm text-gray-700 hover:bg-gray-50 transition">{v}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rewriteResult.hashtags?.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">#️⃣ Suggested Hashtags</p>
                      <div className="flex flex-wrap gap-2">{rewriteResult.hashtags.map((t, i) => <HashtagPill key={i} tag={t} />)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ANALYZE TAB ── */}
        {activeTab === "Analyze" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-2 text-gray-900">📊 Caption Analyzer</h2>
              <p className="text-sm text-gray-500 mb-6">Score your caption's quality and engagement potential.</p>

              <div className="mb-5">
                <Label>Caption to Analyze</Label>
                <textarea value={analyzeCaptionText} onChange={e => setAnalyzeCaptionText(e.target.value)}
                  placeholder="Paste your caption here..."
                  rows={9}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none" />
              </div>

              <div className="mb-6">
                <Label>Platform</Label>
                <Select value={analyzePlatform} onChange={e => setAnalyzePlatform(e.target.value)} options={PLATFORMS} />
              </div>

              <button onClick={handleAnalyze} disabled={analysisLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition shadow-md shadow-purple-200">
                {analysisLoading ? "🤖 Analyzing..." : "📊 Analyze Caption"}
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Analysis Results</h2>
              {!analysisResult && !analysisLoading && <EmptyState icon="📊" text="Your caption analysis will appear here." />}
              {analysisLoading && <LoadingState text="AI is analyzing your caption..." />}
              {analysisResult && !analysisLoading && (
                <div className="space-y-5">
                  {/* Score ring */}
                  <div className={`flex flex-col items-center justify-center border-2 rounded-3xl p-6 ring-4 ${scoreRing(Number(analysisResult.score))}`}>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Overall Score</p>
                    <div className={`text-6xl font-extrabold ${scoreColor(Number(analysisResult.score))}`}>
                      {analysisResult.score}<span className="text-2xl text-gray-300">/100</span>
                    </div>
                    <span className="mt-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">{analysisResult.grade}</span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Readability", analysisResult.readability],
                      ["Tone", analysisResult.tone],
                      ["Engagement", analysisResult.engagement],
                      ["Hook", analysisResult.hook],
                      ["Call to Action", analysisResult.cta],
                      ["Hashtags", analysisResult.hashtag_quality],
                      ["Clarity", analysisResult.clarity],
                      ["Audience Appeal", analysisResult.audience_appeal],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  {analysisResult.suggestions?.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">💡 Improvement Suggestions</p>
                      <div className="space-y-2">
                        {analysisResult.suggestions.map((s, i) => (
                          <div key={i} className="flex gap-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
                            <span className="text-purple-600 font-bold text-sm">{i + 1}</span>
                            <p className="text-sm text-gray-700">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RAG TAB ── */}
        {activeTab === "RAG" && <RagGenerator showToast={showToast} />}

        {/* ── HISTORY TAB ── */}
        {activeTab === "History" && <History showToast={showToast} />}
      </main>

      <footer className="border-t border-gray-100 bg-white py-6 mt-4">
        <p className="text-center text-xs text-gray-400">CaptionCraft AI · Generative AI Social Media Assistant</p>
      </footer>
    </div>
  );
}
