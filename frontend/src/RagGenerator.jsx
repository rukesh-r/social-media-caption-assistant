import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import {
  BrainIcon,
  FileTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  SearchIcon,
  CopyIcon
} from "./Icons";
import {
  InsaneTextArea,
  InsanePlatformSelector,
  InsaneToneSelector,
  InsaneSegmented
} from "./InsaneInput";

const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "X", "YouTube"];
const TONES = ["Friendly", "Professional", "Funny", "Inspirational", "Casual", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Long"];
const AUDIENCES = ["General audience", "Founders & Execs", "Gen-Z & Students", "Industry Experts", "Customers & Buyers"];

const initialForm = {
  topic: "",
  platform: "Instagram",
  tone: "Friendly",
  audience: "General audience",
  keywords: "",
  length: "Medium"
};

function HashtagPill({ tag, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 px-3 py-1 rounded-xl text-xs font-semibold transition"
      title="Click to copy"
    >
      {tag}
    </button>
  );
}

function CopyButton({ onClick, label = "Copy" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl px-3.5 py-1.5 transition shadow-sm"
    >
      <CopyIcon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}

export default function RagGenerator({ showToast }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const updateField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      showToast?.("Please select a document first.", "error");
      return;
    }
    setUploading(true);
    setUploadResult(null);
    try {
      const data = new FormData();
      data.append("file", uploadFile);
      const res = await axios.post(`${API_BASE_URL}/rag/upload-document`, data);
      if (!res.data.success) throw new Error(res.data.error || "Upload failed.");
      setUploadResult(res.data);
      setUploadFile(null);
      showToast?.(`"${res.data.filename}" stored into knowledge base.`);
    } catch (err) {
      showToast?.(err.response?.data?.error || err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const generate = async (e) => {
    if (e) e.preventDefault();
    if (!form.topic.trim()) {
      showToast?.("Please enter a topic or question to query your knowledge base.", "error");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/rag/generate-caption`, form);
      if (!res.data.success) throw new Error(res.data.error || "Generation failed.");
      setResult(res.data.result);
      showToast?.("RAG-grounded caption generated!");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to generate RAG caption.");
      showToast?.("Generation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text, label = "Copied to clipboard!") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast?.(label);
    } catch {
      showToast?.("Copy failed.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Rich Luxury Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-900/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase mb-4 border border-white/20">
            <BrainIcon className="w-3.5 h-3.5" />
            <span>RAG Context Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Knowledge-Grounded Social Captions
          </h2>
          <p className="mt-2 text-purple-100 text-sm sm:text-base leading-relaxed">
            Upload brand playbooks, product sheets, customer research, or tone guides. CaptionCraft extracts semantic chunks to write perfectly factual, on-brand content.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Upload Brand Document (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileTextIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Brand Document</h3>
                <p className="text-xs text-slate-500">PDF, TXT, or Markdown knowledge files</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200/80 hover:border-purple-400 bg-purple-50/20 hover:bg-purple-50/40 rounded-2xl p-6 cursor-pointer transition">
                <FileTextIcon className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-xs font-bold text-slate-700 text-center max-w-[240px] truncate">
                  {uploadFile ? uploadFile.name : "Click to select a document"}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supported formats: .pdf, .txt, .md
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={(e) => setUploadFile(e.target.files[0] || null)}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !uploadFile}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {uploading ? "Extracting & Vectorizing..." : "Upload & Vectorize Document"}
              </button>

              {uploadResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    <span>{uploadResult.filename}</span>
                  </div>
                  <p className="text-emerald-700 text-[11px]">
                    {uploadResult.chunk_count} semantic chunks indexed (
                    {uploadResult.character_count?.toLocaleString()} chars).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RAG Generator & Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Generator Form */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Grounded Post</h3>
                <p className="text-xs text-slate-500">Query your knowledge base to produce verified captions</p>
              </div>
            </div>

            {/* Insane Topic Input */}
            <InsaneTextArea
              label="What should this post cover?"
              name="topic"
              value={form.topic}
              platform={form.platform}
              onChange={(e) => updateField("topic", e.target.value)}
              placeholder="e.g. Summarize our new feature release based on the product spec doc..."
              rows={3}
            />

            {/* Platform Selector */}
            <InsanePlatformSelector
              selected={form.platform}
              onSelect={(p) => updateField("platform", p)}
              platforms={PLATFORMS}
            />

            {/* Tone Selector */}
            <InsaneToneSelector
              selected={form.tone}
              onSelect={(t) => updateField("tone", t)}
              tones={TONES}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InsaneSegmented
                label="Target Audience"
                options={AUDIENCES}
                selected={form.audience}
                onSelect={(val) => updateField("audience", val)}
              />
              <InsaneSegmented
                label="Content Length"
                options={LENGTHS}
                selected={form.length}
                onSelect={(val) => updateField("length", val)}
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching Knowledge & Writing...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  <span>Generate Grounded Caption</span>
                </>
              )}
            </button>
          </div>

          {/* RAG Results Output */}
          {result && (
            <div className="bg-white rounded-3xl border border-purple-100 shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                  <BrainIcon className="w-4 h-4" />
                  <span>Verified RAG Output</span>
                </span>
                <CopyButton onClick={() => copy(result.caption, "Grounded caption copied!")} />
              </div>

              {/* Main Caption Box */}
              <div className="bg-gradient-to-br from-purple-50/70 to-slate-50 border border-purple-100 rounded-2xl p-5 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line shadow-inner">
                {result.caption}
              </div>

              {/* Retrieved Knowledge Context Chunks */}
              {result.retrieved_chunks?.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <SearchIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>Referenced Knowledge Sources ({result.retrieved_chunks.length} chunks)</span>
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.retrieved_chunks.map((chunk, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1"
                      >
                        <div className="font-semibold text-slate-800 flex items-center justify-between text-[11px]">
                          <span>Source: {chunk.document_name}</span>
                          <span className="text-purple-600 font-bold">
                            Score: {(chunk.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="line-clamp-2 italic text-slate-500">"{chunk.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {result.hashtags?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">Suggested Hashtags</span>
                    <button
                      onClick={() => copy(result.hashtags.join(" "), "All hashtags copied!")}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtags.map((tag, i) => (
                      <HashtagPill
                        key={i}
                        tag={tag}
                        onClick={() => copy(tag, `Hashtag ${tag} copied!`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
