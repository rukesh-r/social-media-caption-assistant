import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import Navbar from "./Navbar";
import History from "./History.jsx";
import RagGenerator from "./RagGenerator";
import BrandLogo from "./BrandLogo";
import { supabase } from "./supabaseClient";
import {
  SparklesIcon,
  EditIcon,
  BarChartIcon,
  BrainIcon,
  HistoryIcon,
  CopyIcon,
  AlertTriangleIcon,
  XIcon,
  FileTextIcon,
  TargetIcon,
  RocketIcon,
  BriefcaseIcon,
  SmileIcon,
  StarIcon,
  ZapIcon,
  BotIcon,
  LightbulbIcon,
  LaptopIcon
} from "./Icons";
import {
  InsaneTextArea,
  InsanePlatformSelector,
  InsaneToneSelector,
  InsaneSegmented,
  InsaneImageDropzone
} from "./InsaneInput";

const TABS = ["Generate", "Rewrite", "Analyze", "RAG", "History"];
const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "X"];
const TONES = ["Casual", "Professional", "Funny", "Inspirational", "Exciting", "Promotional"];
const AUDIENCES = ["General", "Professionals", "Founders", "Gen-Z", "Customers"];
const LENGTHS = ["Short", "Medium", "Long"];

const REWRITE_STYLES = [
  { id: "Make More Engaging", label: "More Engaging", icon: <RocketIcon className="w-3.5 h-3.5 text-purple-600" /> },
  { id: "Make Professional", label: "Professional", icon: <BriefcaseIcon className="w-3.5 h-3.5 text-purple-600" /> },
  { id: "Make Funny", label: "Viral Humor", icon: <SmileIcon className="w-3.5 h-3.5 text-purple-600" /> },
  { id: "Make Inspirational", label: "Inspirational", icon: <StarIcon className="w-3.5 h-3.5 text-purple-600" /> },
  { id: "Make Shorter", label: "Punchy & Short", icon: <ZapIcon className="w-3.5 h-3.5 text-purple-600" /> },
  { id: "Add Emojis", label: "Emoji Polish", icon: <SparklesIcon className="w-3.5 h-3.5 text-purple-600" /> }
];

const SUGGESTED_KEYWORDS = ["AI Innovation", "Creative Growth", "Consistency", "Build In Public", "Lifestyle", "Tech Trends"];

function Toast({ message, type, onClose }) {
  const isErr = type === "error";
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl text-xs font-bold transition-all border backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
        isErr
          ? "bg-rose-50/95 text-rose-800 border-rose-200 shadow-rose-900/10"
          : "bg-slate-900/90 text-white border-slate-700/80 shadow-slate-950/20"
      }`}
    >
      {isErr ? (
        <AlertTriangleIcon className="w-4 h-4 text-rose-500 shrink-0" />
      ) : (
        <SparklesIcon className="w-4 h-4 text-purple-400 shrink-0" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 text-sm leading-none p-1 rounded-lg"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </div>
  );
}

function CopyButton({ onClick, label = "Copy" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl px-3 py-1.5 transition shadow-sm active:scale-95"
    >
      <CopyIcon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}

export default function App({ session: initialSession, onSignOut }) {
  const [session, setSession] = useState(initialSession);
  const [activeTab, setActiveTab] = useState("Generate");
  const [toast, setToast] = useState(null);

  // Generate Tab State
  const [formData, setFormData] = useState({
    topic: "",
    platform: "Instagram",
    tone: "Casual",
    audience: "General",
    keywords: "",
    length: "Medium"
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Rewrite Tab State
  const [originalCaption, setOriginalCaption] = useState("");
  const [rewriteStyle, setRewriteStyle] = useState("Make More Engaging");
  const [rewritePlatform, setRewritePlatform] = useState("Instagram");
  const [rewriteResult, setRewriteResult] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Analyze Tab State
  const [analyzeCaptionText, setAnalyzeCaptionText] = useState("");
  const [analyzePlatform, setAnalyzePlatform] = useState("Instagram");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyText = async (text, label = "Copied to clipboard!") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label);
    } catch {
      showToast("Copy failed.", "error");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    onSignOut?.();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      showToast("Please upload a JPG, PNG, or WEBP file.", "error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast("Image must be smaller than 4 MB.", "error");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    showToast("Image attached! Visual context will be analyzed.");
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Generate Caption API
  const generateCaption = async () => {
    if (!formData.topic.trim() && !image) {
      showToast("Please enter a topic or upload an image.", "error");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      let response;
      if (image) {
        const data = new FormData();
        data.append("image", image);
        data.append("platform", formData.platform);
        data.append("tone", formData.tone);
        data.append("audience", formData.audience);
        data.append("length", formData.length);
        response = await axios.post(`${API_BASE_URL}/generate-image-caption`, data);
      } else {
        response = await axios.post(`${API_BASE_URL}/generate-caption`, formData);
      }
      if (response.data.success) {
        setResult(response.data.result);
        showToast("Caption crafted successfully!");
      } else {
        showToast(response.data.error || "Unable to generate caption.", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Connection error with AI backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Rewrite Caption API
  const handleRewrite = async () => {
    if (!originalCaption.trim()) {
      showToast("Please enter an existing caption to rewrite.", "error");
      return;
    }
    setRewriteLoading(true);
    setRewriteResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/rewrite-caption`, {
        caption: originalCaption,
        style: rewriteStyle,
        platform: rewritePlatform
      });
      if (response.data.success) {
        setRewriteResult(response.data.result);
        showToast("Caption rewritten!");
      } else {
        showToast(response.data.error || "Unable to rewrite caption.", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Error connecting to AI rewriter.", "error");
    } finally {
      setRewriteLoading(false);
    }
  };

  // Analyze Caption API
  const handleAnalyze = async () => {
    if (!analyzeCaptionText.trim()) {
      showToast("Please enter a caption to analyze.", "error");
      return;
    }
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-caption`, {
        caption: analyzeCaptionText,
        platform: analyzePlatform
      });
      if (response.data.success) {
        setAnalysisResult(response.data.result);
        showToast("Caption analysis complete!");
      } else {
        showToast(response.data.error || "Unable to analyze caption.", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Error connecting to AI analyzer.", "error");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getScoreColor = (s) => {
    const num = Number(s) || 0;
    if (num >= 85) return "text-emerald-600";
    if (num >= 70) return "text-purple-600";
    if (num >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  const userEmail = session?.user?.email || "Creator";
  const userDisplayName = userEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-[#FAFAFD] text-slate-900 selection:bg-purple-100 selection:text-purple-900 relative">
      {/* Toast Alert */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── TOP NAVBAR ── */}
      <Navbar session={session} onSignOut={handleSignOut} />

      {/* ── MAIN ACTIVITY DASHBOARD ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
        
        {/* Dashboard Welcome & Status Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-50/90 via-white to-indigo-50/60 border border-purple-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 text-purple-800 text-xs font-bold mb-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span>MAIN ACTIVITY DASHBOARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {userDisplayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your AI-powered social copy workspace. Generate, polish, analyze, and retrieve knowledge-grounded posts.
              </p>
            </div>

            {/* Quick Activity Metric Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target</span>
                <span className="text-xs font-bold text-purple-700">{formData.platform}</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tone</span>
                <span className="text-xs font-bold text-slate-800">{formData.tone}</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Engine</span>
                <span className="text-xs font-bold text-emerald-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Workflow Tabs */}
        <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/70 w-fit overflow-x-auto max-w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const tabIcons = {
              Generate: <SparklesIcon className="w-3.5 h-3.5" />,
              Rewrite: <EditIcon className="w-3.5 h-3.5" />,
              Analyze: <BarChartIcon className="w-3.5 h-3.5" />,
              RAG: <BrainIcon className="w-3.5 h-3.5" />,
              History: <HistoryIcon className="w-3.5 h-3.5" />
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-white text-purple-700 shadow-sm shadow-purple-500/10 scale-[1.01]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tabIcons[tab]}</span>
                <span>{tab === "RAG" ? "Knowledge RAG" : tab}</span>
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB 1: GENERATE (INSANE TEXTFIELDS + STUDIO OUTPUT)
        ════════════════════════════════════════════════════════════ */}
        {activeTab === "Generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: INSANE INPUT FORM (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-purple-600" />
                    <span>Caption Studio</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200/60">
                      Multi-Modal AI
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your social post parameters and core prompt idea.
                  </p>
                </div>
              </div>

              {/* Insane Image Dropzone */}
              <InsaneImageDropzone
                image={image}
                preview={imagePreview}
                onImageChange={handleImageChange}
                onRemove={removeImage}
              />

              {/* Insane Textarea for Topic */}
              <InsaneTextArea
                label="Post Topic or Story Idea"
                name="topic"
                value={formData.topic}
                platform={formData.platform}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    generateCaption();
                  }
                }}
                placeholder="e.g. Scaling our engineering team to 50 members — key mistakes we made and how we built a strong culture"
                rows={4}
              />

              {/* Platform Selector Grid */}
              <InsanePlatformSelector
                selected={formData.platform}
                onSelect={(plat) => setFormData({ ...formData, platform: plat })}
                platforms={PLATFORMS}
              />

              {/* Tone Aesthetic Selector */}
              <InsaneToneSelector
                selected={formData.tone}
                onSelect={(tone) => setFormData({ ...formData, tone: tone })}
                tones={TONES}
              />

              {/* Audience and Length Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InsaneSegmented
                  label="Target Audience"
                  options={AUDIENCES}
                  selected={formData.audience}
                  onSelect={(aud) => setFormData({ ...formData, audience: aud })}
                />
                <InsaneSegmented
                  label="Target Caption Length"
                  options={LENGTHS}
                  selected={formData.length}
                  onSelect={(len) => setFormData({ ...formData, length: len })}
                />
              </div>

              {/* Keywords Input with Suggested Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">Keywords & Context Hints</label>
                  <span className="text-[11px] text-slate-400">Comma separated</span>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition">
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="AI, Innovation, Culture, Leadership"
                    className="w-full bg-transparent px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
                {/* Quick keyword chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
                  {SUGGESTED_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        const current = formData.keywords ? `${formData.keywords}, ${kw}` : kw;
                        setFormData({ ...formData, keywords: current });
                      }}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200/50 transition"
                    >
                      +{kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={generateCaption}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Engine Crafting Content...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>Generate High-Converting Caption</span>
                    <span className="text-purple-200 text-xs hidden sm:inline">(⌘ + Enter)</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT: GENERATED STUDIO CONTENT (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TargetIcon className="w-4 h-4 text-purple-600" />
                  <span>Generated Output</span>
                  {result && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Ready
                    </span>
                  )}
                </h3>
              </div>

              {!result && !loading && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                    <SparklesIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Your Generated Output Will Appear Here</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Configure your post parameters on the left and click Generate to produce customized viral copy, alternatives, and hashtags.
                  </p>
                </div>
              )}

              {loading && (
                <div className="py-24 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 animate-bounce">
                    <BotIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Generating Caption & Angles...</h4>
                    <p className="text-xs text-slate-400">
                      Structuring hooks, tone alignments, and strategic hashtags.
                    </p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Primary Caption Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileTextIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Main Caption</span>
                        <span className="text-[10px] text-slate-400">
                          ({result.caption.split(/\s+/).filter(Boolean).length} words)
                        </span>
                      </span>
                      <CopyButton onClick={() => copyText(result.caption, "Main caption copied!")} />
                    </div>

                    <div className="bg-gradient-to-br from-purple-50/60 to-slate-50 border border-purple-100 rounded-2xl p-4 sm:p-5 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line shadow-inner">
                      {result.caption}
                    </div>

                    {/* Quick send-to actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Send to:</span>
                      <button
                        onClick={() => {
                          setOriginalCaption(result.caption);
                          setActiveTab("Rewrite");
                        }}
                        className="text-[11px] text-purple-700 hover:underline font-semibold flex items-center gap-1"
                      >
                        <EditIcon className="w-3 h-3" />
                        <span>Rewriter</span>
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => {
                          setAnalyzeCaptionText(result.caption);
                          setActiveTab("Analyze");
                        }}
                        className="text-[11px] text-purple-700 hover:underline font-semibold flex items-center gap-1"
                      >
                        <BarChartIcon className="w-3 h-3" />
                        <span>Tone Analyzer</span>
                      </button>
                    </div>
                  </div>

                  {/* Alternative Hooks */}
                  {result.alternatives?.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <LightbulbIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Alternative Angles & Hooks</span>
                      </span>
                      <div className="space-y-2">
                        {result.alternatives.map((alt, i) => (
                          <div
                            key={i}
                            className="group p-3 rounded-xl border border-slate-200/80 hover:border-purple-200 bg-slate-50/40 hover:bg-purple-50/30 transition flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="text-xs font-bold text-purple-600 mt-0.5">{i + 1}.</span>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{alt}</p>
                            </div>
                            <button
                              onClick={() => copyText(alt, `Alternative ${i + 1} copied!`)}
                              className="text-slate-400 hover:text-purple-600 p-1 transition shrink-0"
                              title="Copy alternative"
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hashtags */}
                  {result.hashtags?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Strategic Hashtags</span>
                        <button
                          onClick={() => copyText(result.hashtags.join(" "), "All hashtags copied!")}
                          className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                        >
                          Copy All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.hashtags.map((tag, i) => (
                          <button
                            key={i}
                            onClick={() => copyText(tag, `Hashtag ${tag} copied!`)}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 px-2.5 py-1 rounded-xl text-xs font-semibold transition"
                            title="Click to copy"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  {result.call_to_action && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
                      <TargetIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">Recommended Call-to-Action:</span>
                        <p className="text-amber-800 font-medium">{result.call_to_action}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: REWRITE
        ════════════════════════════════════════════════════════════ */}
        {activeTab === "Rewrite" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <EditIcon className="w-4 h-4 text-blue-600" />
                  <span>Caption Polish & Rewriter</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                    Style Transfer
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste an existing caption to sharpen its hook, boost readability, or change voice.
                </p>
              </div>

              {/* Insane Existing Caption Input */}
              <InsaneTextArea
                label="Existing Caption to Refine"
                value={originalCaption}
                onChange={(e) => setOriginalCaption(e.target.value)}
                placeholder="Paste your existing post here to test alternative tones and viral structures..."
                rows={6}
              />

              {/* Rewrite Style Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Rewrite Objective</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REWRITE_STYLES.map((st) => {
                    const isSelected = rewriteStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setRewriteStyle(st.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? "bg-purple-50 text-purple-800 border-purple-300 font-bold ring-1 ring-purple-300"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        <span>{st.icon}</span>
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Selector */}
              <InsanePlatformSelector
                selected={rewritePlatform}
                onSelect={(p) => setRewritePlatform(p)}
                platforms={PLATFORMS}
              />

              <button
                type="button"
                onClick={handleRewrite}
                disabled={rewriteLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {rewriteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rewriting with AI...</span>
                  </>
                ) : (
                  <>
                    <EditIcon className="w-4 h-4" />
                    <span>Polish & Rewrite Caption</span>
                  </>
                )}
              </button>
            </div>

            {/* Rewritten Output */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
              <h3 className="text-base font-bold text-slate-900">Rewritten Output</h3>

              {!rewriteResult && !rewriteLoading && (
                <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                  <EditIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Paste a caption on the left and select an objective to rewrite.</p>
                </div>
              )}

              {rewriteLoading && (
                <div className="py-24 text-center text-xs text-slate-500 space-y-3">
                  <div className="w-8 h-8 mx-auto border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p>Refining hook, structure, and readability...</p>
                </div>
              )}

              {rewriteResult && !rewriteLoading && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <SparklesIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Refined Caption</span>
                      </span>
                      <CopyButton onClick={() => copyText(rewriteResult.rewritten_caption)} />
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/70 to-slate-50 border border-purple-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line shadow-inner">
                      {rewriteResult.rewritten_caption}
                    </div>
                  </div>

                  {rewriteResult.alternative_versions?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <LightbulbIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Variations</span>
                      </span>
                      <div className="space-y-2">
                        {rewriteResult.alternative_versions.map((v, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 text-xs text-slate-700 flex items-start justify-between gap-2"
                          >
                            <span className="flex-1">{v}</span>
                            <button
                              onClick={() => copyText(v, "Variation copied!")}
                              className="text-slate-400 hover:text-purple-600 p-1"
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rewriteResult.hashtags?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700">Suggested Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {rewriteResult.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            onClick={() => copyText(tag, `Hashtag ${tag} copied!`)}
                            className="cursor-pointer text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: ANALYZE
        ════════════════════════════════════════════════════════════ */}
        {activeTab === "Analyze" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChartIcon className="w-4 h-4 text-emerald-600" />
                  <span>Caption Quality & Virality Analyzer</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                    Engagement Diagnostics
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluate hook strength, clarity, readability, and engagement potential.
                </p>
              </div>

              {/* Insane Analyze Input */}
              <InsaneTextArea
                label="Caption To Evaluate"
                value={analyzeCaptionText}
                onChange={(e) => setAnalyzeCaptionText(e.target.value)}
                placeholder="Paste the caption you want to evaluate before publishing..."
                rows={8}
              />

              <InsanePlatformSelector
                selected={analyzePlatform}
                onSelect={(p) => setAnalyzePlatform(p)}
                platforms={PLATFORMS}
              />

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analysisLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {analysisLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Metrics...</span>
                  </>
                ) : (
                  <>
                    <BarChartIcon className="w-4 h-4" />
                    <span>Run Deep Engagement Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results View */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-slate-900">Diagnostic Breakdown</h3>

              {!analysisResult && !analysisLoading && (
                <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                  <BarChartIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Input a caption on the left to receive an engagement audit.</p>
                </div>
              )}

              {analysisLoading && (
                <div className="py-24 text-center text-xs text-slate-500 space-y-3">
                  <div className="w-8 h-8 mx-auto border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p>Computing readability, hook impact, and audience resonance...</p>
                </div>
              )}

              {analysisResult && !analysisLoading && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Hyper-realistic Score Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-50/70 via-white to-slate-50 border border-purple-200/80 text-center relative overflow-hidden shadow-sm">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Overall Virality & Engagement Score
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-6xl font-black ${getScoreColor(analysisResult.score)}`}>
                        {analysisResult.score}
                      </span>
                      <span className="text-2xl font-bold text-slate-300">/100</span>
                    </div>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                      Grade: {analysisResult.grade}
                    </span>
                  </div>

                  {/* 8 Metric Diagnostic Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Readability", analysisResult.readability],
                      ["Tone Match", analysisResult.tone],
                      ["Engagement", analysisResult.engagement],
                      ["Hook Strength", analysisResult.hook],
                      ["Call To Action", analysisResult.cta],
                      ["Hashtag Relevance", analysisResult.hashtag_quality],
                      ["Clarity", analysisResult.clarity],
                      ["Audience Appeal", analysisResult.audience_appeal]
                    ].map(([metric, val]) => (
                      <div
                        key={metric}
                        className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-0.5"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {metric}
                        </span>
                        <span className="text-xs font-bold text-slate-800 block truncate">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actionable Improvement Tips */}
                  {analysisResult.suggestions?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <LightbulbIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Actionable Recommendations</span>
                      </span>
                      <div className="space-y-2">
                        {analysisResult.suggestions.map((sug, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-700 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-purple-200/80 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{sug}</span>
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

        {/* ════════════════════════════════════════════════════════════
            TAB 4: KNOWLEDGE RAG
        ════════════════════════════════════════════════════════════ */}
        {activeTab === "RAG" && <RagGenerator showToast={showToast} />}

        {/* ════════════════════════════════════════════════════════════
            TAB 5: HISTORY
        ════════════════════════════════════════════════════════════ */}
        {activeTab === "History" && <History showToast={showToast} />}
      </main>

      {/* ── CLASSIC RICH FOOTER ── */}
      <footer className="border-t border-slate-200/70 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" showSubtitle={true} />

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-slate-600 text-center sm:text-left">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <LaptopIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Designed &amp; Developed by:</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                Rasetty Rukesh
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                T Karthik
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                M Nithin Rao
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                P Dinesh Kumar Reddy
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                G Rama Krishna
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            CaptionCraft AI · All rights reserved.
          </p>
        </div>

        {/* Course & Mentorship Credit */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 leading-relaxed">
            Built under the course of{" "}
            <span className="font-bold text-slate-700">Generative AI – Artificial Intelligence</span>
            {" "}with the mentorship of{" "}
            <span className="font-bold text-purple-700">Shirwin Prince</span>
            {" "}from{" "}
            <span className="font-bold text-slate-700">Infoziant</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
