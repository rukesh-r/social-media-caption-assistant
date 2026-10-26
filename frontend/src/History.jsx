import { useEffect, useState } from "react";
import axios from "axios";

export default function History({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/history");
      if (res.data.success) setHistory(res.data.history);
    } catch {
      showToast?.("Unable to load history.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/history/${id}`);
      setHistory(h => h.filter(i => i.id !== id));
      showToast?.("Deleted.");
    } catch {
      showToast?.("Unable to delete.", "error");
    }
  };

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  useEffect(() => { loadHistory(); }, []);

  const typeColor = (type) => {
    if (type === "generate") return "bg-purple-100 text-purple-700";
    if (type === "rewrite") return "bg-blue-100 text-blue-700";
    if (type === "analyze") return "bg-emerald-100 text-emerald-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📜 Caption History</h2>
          <p className="text-sm text-gray-500 mt-1">Your previously generated AI content.</p>
        </div>
        <button onClick={loadHistory}
          className="text-sm border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition text-gray-600">
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-4xl animate-pulse block mb-3">🤖</span>
          Loading history...
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center text-gray-400">
          <span className="text-5xl block mb-4">📭</span>
          No caption history yet. Generate something!
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-100 transition">
              {/* Header row */}
              <div className="flex items-center justify-between gap-4 p-4 cursor-pointer" onClick={() => toggle(item.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${typeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full shrink-0">{item.platform}</span>
                  <p className="text-sm text-gray-700 truncate">{item.input_text}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <button onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-lg px-2.5 py-1 hover:bg-red-50 transition">
                    Delete
                  </button>
                  <span className="text-gray-400 text-sm">{expanded[item.id] ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded content */}
              {expanded[item.id] && (
                <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                  {item.result?.caption && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Generated Caption</p>
                      <p className="text-sm text-gray-800">{item.result.caption}</p>
                    </div>
                  )}
                  {item.result?.rewritten_caption && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Rewritten Caption</p>
                      <p className="text-sm text-gray-800">{item.result.rewritten_caption}</p>
                    </div>
                  )}
                  {item.result?.score !== undefined && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">Analysis Score</p>
                        <p className="text-2xl font-extrabold text-emerald-600">{item.result.score}<span className="text-sm text-gray-400">/100</span></p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">{item.result.grade}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
