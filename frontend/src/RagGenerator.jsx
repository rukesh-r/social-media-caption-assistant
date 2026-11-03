import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "./supabaseClient";

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

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Documents list
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const getAuthHeader = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new Error("Not authenticated.");
    return { Authorization: `Bearer ${token}` };
  };

  const loadDocuments = async () => {
    setDocsLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await axios.get("http://127.0.0.1:5000/rag/documents", { headers });
      if (res.data.success) setDocuments(res.data.documents);
    } catch { /* silent */ } finally { setDocsLoading(false); }
  };

  useEffect(() => { loadDocuments(); }, []);

  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpload = async () => {
    if (!uploadFile) { showToast?.("Please select a file.", "error"); return; }
    setUploading(true); setUploadResult(null);
    try {
      const headers = await getAuthHeader();
      const data = new FormData();
      data.append("file", uploadFile);
      const res = await axios.post("http://127.0.0.1:5000/rag/upload-document", data, { headers });
      if (!res.data.success) throw new Error(res.data.error || "Upload failed.");
      setUploadResult(res.data);
      setUploadFile(null);
      showToast?.(`✅ "${res.data.filename}" uploaded — ${res.data.chunk_count} chunks stored.`);
      loadDocuments();
    } catch (err) {
      showToast?.(err.response?.data?.error || err.message || "Upload failed.", "error");
    } finally { setUploading(false); }
  };

  const handleDeleteDocument = async (name) => {
    try {
      const headers = await getAuthHeader();
      await axios.delete(`http://127.0.0.1:5000/rag/documents/${encodeURIComponent(name)}`, { headers });
      setDocuments(d => d.filter(doc => doc.document_name !== name));
      showToast?.("Document deleted.");
    } catch (err) {
      showToast?.(err.response?.data?.error || "Unable to delete document.", "error");
    }
  };

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const headers = await getAuthHeader();
      const res = await axios.post("http://127.0.0.1:5000/rag/generate-caption", form, { headers });
      if (!res.data.success) throw new Error(res.data.error || "Generation failed.");
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to generate a RAG caption.");
    } finally { setLoading(false); }
  };

  const copy = async (text, label = "Copied!") => {
    try { await navigator.clipboard.writeText(text); showToast?.(label); }
    catch { showToast?.("Copy failed.", "error"); }
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
          Upload your brand documents, then generate captions grounded in your own knowledge base.
        </p>
      </div>

      {/* Step 1 — Upload document */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">1</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upload Knowledge Document</h3>
            <p className="text-sm text-gray-500">PDF, TXT, or MD — your brand info, product details, tone guide, etc.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition">
            <span className="text-3xl mb-2">📄</span>
            <span className="text-sm text-gray-500 text-center">
              {uploadFile ? uploadFile.name : "Click to select a PDF, TXT, or MD file"}
            </span>
            <input type="file" accept=".pdf,.txt,.md" onChange={e => setUploadFile(e.target.files[0] || null)} className="hidden" />
          </label>

          <button onClick={handleUpload} disabled={uploading || !uploadFile}
            className="shrink-0 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 transition shadow-md shadow-purple-200">
            {uploading ? "Uploading..." : "Upload & Process"}
          </button>
        </div>

        {uploadResult && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-800">
            ✅ <span className="font-semibold">{uploadResult.filename}</span> processed —{" "}
            {uploadResult.chunk_count} chunks stored ({uploadResult.character_count?.toLocaleString()} characters).
          </div>
        )}
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📚 Knowledge Base</h3>
            <p className="text-sm text-gray-500 mt-0.5">Documents stored in your knowledge base.</p>
          </div>
          <button onClick={loadDocuments}
            className="text-sm border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition text-gray-600">
            🔄 Refresh
          </button>
        </div>

        {docsLoading && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading documents...</div>
        )}

        {!docsLoading && documents.length === 0 && (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No documents uploaded yet. Upload a PDF, TXT, or MD file above.
          </div>
        )}

        {!docsLoading && documents.length > 0 && (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.document_name}
                className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl px-5 py-4 hover:border-purple-100 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">📄</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.document_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.chunk_count} chunks stored</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteDocument(doc.document_name)}
                  className="shrink-0 text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-50 transition">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 2 — Generate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">2</span>
            <h3 className="text-lg font-bold text-gray-900">Generate RAG Caption</h3>
          </div>

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
              <p className="text-xs mt-2 text-gray-300">Upload a document first, then generate.</p>
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
              <div className={`rounded-2xl p-4 ${result.rag_metadata?.retrieved_count > 0 ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
                <p className={`text-sm font-bold mb-2 ${result.rag_metadata?.retrieved_count > 0 ? "text-emerald-800" : "text-amber-800"}`}>
                  🔍 RAG Retrieval Details
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Retrieved chunks: <span className="font-semibold">{result.rag_metadata?.retrieved_count ?? 0}</span>
                  {result.rag_metadata?.retrieved_count === 0 && " — upload a document to enable knowledge-grounded generation"}
                </p>
                {result.rag_metadata?.sources?.length > 0 && (
                  <div className="space-y-2">
                    {result.rag_metadata.sources.map((s, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 text-xs">
                        <p className="font-semibold text-gray-800">{s.document_name}</p>
                        <p className="text-gray-500 mt-0.5">Similarity: {Number(s.similarity).toFixed(3)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
