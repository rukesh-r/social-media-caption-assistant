import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    topic: "",
    platform: "Instagram",
    tone: "Casual",
    audience: "General",
    keywords: "",
    length: "Medium",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateCaption = async () => {
    if (!formData.topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-caption",
        formData
      );

      setResult(response.data.result);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Unable to generate caption. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text, message = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const copyHashtags = () => {
    if (result?.hashtags) {
      copyText(result.hashtags.join(" "), "Hashtags copied!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-purple-600">
                CaptionCraft AI
              </h1>

              <p className="text-sm text-gray-500">
                AI-powered social media content assistant
              </p>
            </div>

            <div className="hidden sm:block text-sm text-gray-500">
              Powered by Generative AI
            </div>

          </div>

        </div>
      </nav>


      {/* Hero */}

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            Create Better Social Media Captions
          </h2>

          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Generate personalized captions, hashtags and call-to-actions
            using Generative AI.
          </p>

        </div>

      </section>


      {/* Main */}

      <main className="max-w-7xl mx-auto px-6 pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          {/* INPUT PANEL */}

          <div className="bg-white rounded-2xl border shadow-sm p-7">

            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              ✨ Create Content
            </h3>


            {/* Topic */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Topic
              </label>

              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: College hackathon experience"
                rows="4"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

            </div>


            {/* Platform */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>

                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                >
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Facebook</option>
                  <option>X</option>
                </select>

              </div>


              {/* Tone */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>

                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                >
                  <option>Casual</option>
                  <option>Professional</option>
                  <option>Funny</option>
                  <option>Inspirational</option>
                  <option>Exciting</option>
                  <option>Promotional</option>
                </select>

              </div>

            </div>


            {/* Audience */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>

              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3"
              >
                <option>General</option>
                <option>College Students</option>
                <option>Professionals</option>
                <option>Entrepreneurs</option>
                <option>Customers</option>
                <option>Friends</option>
              </select>

            </div>


            {/* Keywords */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>

              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="AI, innovation, teamwork"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

            </div>


            {/* Length */}

            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption Length
              </label>

              <select
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3"
              >
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>

            </div>


            {/* Error */}

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}


            {/* Generate */}

            <button
              onClick={generateCaption}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "✨ Generating..." : "✨ Generate Caption"}
            </button>

          </div>


          {/* OUTPUT PANEL */}

          <div className="bg-white rounded-2xl border shadow-sm p-7">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-semibold text-gray-900">
                AI Generated Content
              </h3>

              {result && (
                <button
                  onClick={generateCaption}
                  disabled={loading}
                  className="text-sm text-purple-600 hover:underline"
                >
                  🔄 Regenerate
                </button>
              )}

            </div>


            {/* Empty State */}

            {!result && !loading && (

              <div className="h-[500px] flex items-center justify-center">

                <div className="text-center">

                  <div className="text-6xl mb-5">
                    ✨
                  </div>

                  <h4 className="text-lg font-semibold text-gray-700">
                    Your content will appear here
                  </h4>

                  <p className="text-gray-400 mt-2">
                    Fill in the details and generate your caption.
                  </p>

                </div>

              </div>

            )}


            {/* Loading */}

            {loading && (

              <div className="h-[500px] flex items-center justify-center">

                <div className="text-center">

                  <div className="text-6xl animate-pulse mb-5">
                    🤖
                  </div>

                  <h4 className="font-semibold text-gray-700">
                    AI is creating your content...
                  </h4>

                  <p className="text-gray-400 mt-2">
                    This may take a few seconds.
                  </p>

                </div>

              </div>

            )}


            {/* Results */}

            {result && !loading && (

              <div className="space-y-6">


                {/* Main Caption */}

                <div>

                  <div className="flex justify-between items-center mb-2">

                    <h4 className="font-semibold text-gray-800">
                      📝 Main Caption
                    </h4>

                    <button
                      onClick={() =>
                        copyText(result.caption, "Caption copied!")
                      }
                      className="text-sm text-purple-600 hover:underline"
                    >
                      📋 Copy
                    </button>

                  </div>

                  <div className="bg-slate-50 border rounded-xl p-5 leading-relaxed text-gray-700">
                    {result.caption}
                  </div>

                </div>


                {/* Alternatives */}

                <div>

                  <h4 className="font-semibold text-gray-800 mb-3">
                    💡 Alternative Captions
                  </h4>

                  <div className="space-y-3">

                    {result.alternatives?.map((caption, index) => (

                      <div
                        key={index}
                        className="border rounded-xl p-4 bg-white"
                      >

                        <div className="flex gap-3">

                          <span className="font-semibold text-purple-600">
                            {index + 1}.
                          </span>

                          <p className="text-gray-700 flex-1">
                            {caption}
                          </p>

                          <button
                            onClick={() =>
                              copyText(caption, "Caption copied!")
                            }
                            className="text-gray-400 hover:text-purple-600"
                          >
                            📋
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>


                {/* Hashtags */}

                <div>

                  <div className="flex justify-between items-center mb-3">

                    <h4 className="font-semibold text-gray-800">
                      #️⃣ Hashtags
                    </h4>

                    <button
                      onClick={copyHashtags}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Copy All
                    </button>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {result.hashtags?.map((tag, index) => (

                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                </div>


                {/* CTA */}

                <div>

                  <h4 className="font-semibold text-gray-800 mb-3">
                    🎯 Call to Action
                  </h4>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-800">
                    {result.call_to_action}
                  </div>

                </div>


                {/* Emojis */}

                <div>

                  <h4 className="font-semibold text-gray-800 mb-3">
                    😊 Suggested Emojis
                  </h4>

                  <div className="flex gap-3 text-2xl">

                    {result.emojis?.map((emoji, index) => (
                      <span key={index}>
                        {emoji}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      </main>


      {/* Footer */}

      <footer className="border-t bg-white py-6">

        <p className="text-center text-sm text-gray-400">
          CaptionCraft AI • Generative AI Social Media Assistant
        </p>

      </footer>

    </div>
  );
}

export default App;