import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { HistoryIcon, RefreshIcon, XIcon, InboxIcon, TrashIcon } from "./Icons";

export default function History({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/history");
      if (res.data.success) setHistory(res.data.history || []);
    } catch {
      showToast?.("Unable to load history.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/history/${id}`);
      setHistory((h) => h.filter((i) => i.id !== id));
      showToast?.("Item deleted from history.");
    } catch {
      showToast?.("Unable to delete item.", "error");
    }
  };

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const copyText = async (text, label = "Caption copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast?.(label);
    } catch {
      showToast?.("Copy failed.", "error");
    }
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const typeColor = (type) => {
    if (type === "generate" || type === "generated") return "bg-purple-100 text-purple-700";
    if (type === "rewrite") return "bg-blue-100 text-blue-700";
    if (type === "analyze") return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.input_text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.result?.caption || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "All" || item.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-purple-600" />
            <span>Caption Vault History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access, copy, and manage your previously generated and analyzed social content.
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition"
        >
          <RefreshIcon className="w-3.5 h-3.5 text-slate-600" />
          <span>Refresh Vault</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, topics, or captions..."
            className="w-full bg-transparent px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Platform Filter Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 overflow-x-auto">
          {["All", "Instagram", "LinkedIn", "Facebook", "X"].map((plat) => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${filterPlatform === plat
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="inline-block w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Retrieving stored records...</p>
        </div>
      )}

      {!loading && filteredHistory.length === 0 && (
        <div className="py-16 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
          <InboxIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Captions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? "No items match your search filters. Try clearing the search."
              : "Generate some fresh captions in the studio and they will automatically appear in your history!"}
          </p>
        </div>
      )}

      {/* History Items List */}
      {!loading && filteredHistory.length > 0 && (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isExp = !!expanded[item.id];
            const caption = item.result?.caption || item.result?.rewritten_caption;
            const hashtags = item.result?.hashtags || [];

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isExp
                    ? "border-purple-200 shadow-md bg-white ring-1 ring-purple-100"
                    : "border-slate-200/70 hover:border-purple-200 bg-white"
                  }`}
              >
                {/* Header row */}
                <div
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/50 transition"
                  onClick={() => toggle(item.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${typeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {item.platform || "Social"}
                    </span>
                    <p className="text-xs font-medium text-slate-800 truncate max-w-[200px] sm:max-w-md">
                      {item.input_text || "Untitled Generation"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400 hidden md:inline">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                    </span>

                    {caption && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(caption);
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200/60 transition"
                      >
                        Copy
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 text-xs p-1 rounded-lg hover:bg-rose-50 transition"
                      title="Delete entry"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-slate-400 text-xs">{isExp ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExp && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-3">
                    {caption && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Full Output Content:
                        </span>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-line shadow-inner">
                          {caption}
                        </div>
                      </div>
                    )}

                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            onClick={() => copyText(tag, `Hashtag ${tag} copied!`)}
                            className="cursor-pointer text-[11px] font-medium px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
