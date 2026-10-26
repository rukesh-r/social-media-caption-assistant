
import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

const initialForm = {
  topic: "",
  platform: "Instagram",
  tone: "Friendly",
  audience: "General audience",
  keywords: "",
  length: "Medium",
};

function RagGenerator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generateCaption = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/rag/generate-caption`,
        form
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || "Caption generation failed."
        );
      }

      setResult(response.data.result);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Unable to generate a RAG caption."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Unable to copy. Please copy the text manually.");
    }
  };

  return (
    <section className="mx-auto my-10 max-w-5xl px-4">
      <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-7">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
            RAG POWERED AI
          </span>

          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Knowledge-Based Caption Generator
          </h2>

          <p className="mt-2 text-gray-600">
            Generate personalized captions using relevant information
            retrieved from your uploaded knowledge base.
          </p>
        </div>

        <form onSubmit={generateCaption} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Caption Topic *
            </label>

            <textarea
              name="topic"
              value={form.topic}
              onChange={updateField}
              required
              rows={3}
              placeholder="Example: Promote CaptionCraft AI to creators"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Platform
              </label>

              <select
                name="platform"
                value={form.platform}
                onChange={updateField}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                {["Instagram", "LinkedIn", "Facebook", "X", "YouTube"].map(
                  (platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Tone
              </label>

              <select
                name="tone"
                value={form.tone}
                onChange={updateField}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                {[
                  "Friendly",
                  "Professional",
                  "Funny",
                  "Inspirational",
                  "Casual",
                  "Persuasive",
                ].map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Target Audience
              </label>

              <input
                name="audience"
                value={form.audience}
                onChange={updateField}
                className="w-full rounded-xl border border-gray-300 p-3"
                placeholder="Content creators"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Caption Length
              </label>

              <select
                name="length"
                value={form.length}
                onChange={updateField}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                {["Short", "Medium", "Long"].map((length) => (
                  <option key={length} value={length}>
                    {length}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Keywords
            </label>

            <input
              name="keywords"
              value={form.keywords}
              onChange={updateField}
              className="w-full rounded-xl border border-gray-300 p-3"
              placeholder="personalized captions, engagement"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Searching Knowledge Base and Generating..."
              : "✨ Generate RAG Caption"}
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-purple-900">
                  Generated Caption
                </h3>

                <button
                  type="button"
                  onClick={() => copyText(result.caption)}
                  className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm hover:bg-purple-100"
                >
                  Copy
                </button>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-gray-800">
                {result.caption}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-lg font-bold">Alternative Captions</h3>

              <div className="mt-3 space-y-3">
                {(result.alternatives || []).map((caption, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <p className="whitespace-pre-wrap">{caption}</p>

                    <button
                      type="button"
                      onClick={() => copyText(caption)}
                      className="shrink-0 text-sm font-medium text-purple-700"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-lg font-bold">Hashtags</h3>

              <p className="mt-3 break-words text-purple-700">
                {(result.hashtags || []).join(" ")}
              </p>

              <button
                type="button"
                onClick={() =>
                  copyText((result.hashtags || []).join(" "))
                }
                className="mt-3 rounded-lg border px-3 py-2 text-sm"
              >
                Copy Hashtags
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <h3 className="font-bold">Emojis</h3>
                <p className="mt-3 text-2xl">
                  {(result.emojis || []).join(" ")}
                </p>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="font-bold">Call to Action</h3>
                <p className="mt-3">{result.call_to_action}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <h3 className="font-bold text-green-900">
                RAG Retrieval Details
              </h3>

              <p className="mt-2 text-sm text-gray-700">
                Retrieved chunks:{" "}
                {result.rag_metadata?.retrieved_count ?? 0}
              </p>

              {result.rag_metadata?.sources?.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {result.rag_metadata.sources.map((source, index) => (
                    <li
                      key={`${source.document_name}-${index}`}
                      className="rounded-lg bg-white p-3 text-sm"
                    >
                      <p className="font-medium">
                        {source.document_name}
                      </p>

                      <p className="text-gray-600">
                        Similarity:{" "}
                        {Number(source.similarity).toFixed(3)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-600">
                  No relevant documents were retrieved. This caption
                  was generated without retrieved knowledge.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RagGenerator;
