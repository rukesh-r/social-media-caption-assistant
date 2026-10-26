import { useState } from "react";
import axios from "axios";
import History from "./History.jsx";
import RagGenerator from "./RagGenerator";
function App() {

  // ============================================================
  // MAIN GENERATOR FORM
  // ============================================================

  const [formData, setFormData] = useState({
    topic: "",
    platform: "Instagram",
    tone: "Casual",
    audience: "General",
    keywords: "",
    length: "Medium"
  });


  // ============================================================
  // IMAGE
  // ============================================================

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);


  // ============================================================
  // GENERATOR RESULT
  // ============================================================

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);


  // ============================================================
  // REWRITER
  // ============================================================

  const [originalCaption, setOriginalCaption] = useState("");

  const [rewriteStyle, setRewriteStyle] =
    useState("Make More Engaging");

  const [rewritePlatform, setRewritePlatform] =
    useState("Instagram");

  const [rewriteResult, setRewriteResult] =
    useState(null);

  const [rewriteLoading, setRewriteLoading] =
    useState(false);


  // ============================================================
  // CAPTION ANALYZER
  // ============================================================

  const [analyzeCaptionText, setAnalyzeCaptionText] =
    useState("");

  const [analyzePlatform, setAnalyzePlatform] =
    useState("Instagram");

  const [analysisResult, setAnalysisResult] =
    useState(null);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);


  // ============================================================
  // ERROR
  // ============================================================

  const [error, setError] = useState("");


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (event) => {

    setFormData({

      ...formData,

      [event.target.name]:
        event.target.value

    });

  };


  // ============================================================
  // IMAGE UPLOAD
  // ============================================================

  const handleImageChange = (event) => {

    const selectedImage =
      event.target.files[0];


    if (!selectedImage) {
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp"
    ];


    if (
      !allowedTypes.includes(
        selectedImage.type
      )
    ) {

      setError(
        "Please upload JPG, JPEG, PNG or WEBP."
      );

      return;

    }


    if (
      selectedImage.size >
      10 * 1024 * 1024
    ) {

      setError(
        "Image must be less than 10 MB."
      );

      return;

    }


    setImage(selectedImage);


    setImagePreview(
      URL.createObjectURL(
        selectedImage
      )
    );


    setError("");

  };


  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = () => {

    setImage(null);

    setImagePreview(null);

  };


  // ============================================================
  // GENERATE CAPTION
  // ============================================================

  const generateCaption = async () => {

    if (
      !formData.topic.trim() &&
      !image
    ) {

      setError(
        "Enter a topic or upload an image."
      );

      return;

    }


    setLoading(true);

    setError("");

    setResult(null);


    try {

      let response;


      // ========================================================
      // IMAGE
      // ========================================================

      if (image) {

        const data =
          new FormData();


        data.append(
          "image",
          image
        );


        data.append(
          "platform",
          formData.platform
        );


        data.append(
          "tone",
          formData.tone
        );


        data.append(
          "audience",
          formData.audience
        );


        data.append(
          "length",
          formData.length
        );


        response =
          await axios.post(

            "http://127.0.0.1:5000/generate-image-caption",

            data

          );

      }


      // ========================================================
      // TEXT
      // ========================================================

      else {

        response =
          await axios.post(

            "http://127.0.0.1:5000/generate-caption",

            formData

          );

      }


      if (
        response.data.success
      ) {

        setResult(
          response.data.result
        );

      }


      else {

        setError(
          response.data.error
        );

      }

    }


    catch (err) {

      console.error(err);


      setError(

        err.response?.data?.error ||

        "Unable to generate caption."

      );

    }


    finally {

      setLoading(false);

    }

  };


  // ============================================================
  // REWRITE CAPTION
  // ============================================================

  const handleRewrite = async () => {

    if (
      !originalCaption.trim()
    ) {

      setError(
        "Enter a caption to rewrite."
      );

      return;

    }


    setRewriteLoading(true);

    setError("");

    setRewriteResult(null);


    try {

      const response =
        await axios.post(

          "http://127.0.0.1:5000/rewrite-caption",

          {

            caption:
              originalCaption,

            style:
              rewriteStyle,

            platform:
              rewritePlatform

          }

        );


      if (
        response.data.success
      ) {

        setRewriteResult(
          response.data.result
        );

      }


      else {

        setError(
          response.data.error
        );

      }

    }


    catch (err) {

      console.error(err);


      setError(

        err.response?.data?.error ||

        "Unable to rewrite caption."

      );

    }


    finally {

      setRewriteLoading(false);

    }

  };


  // ============================================================
  // ANALYZE CAPTION
  // ============================================================

  const handleAnalyzeCaption = async () => {

    if (
      !analyzeCaptionText.trim()
    ) {

      setError(
        "Enter a caption to analyze."
      );

      return;

    }


    setAnalysisLoading(true);

    setError("");

    setAnalysisResult(null);


    try {

      const response =
        await axios.post(

          "http://127.0.0.1:5000/analyze-caption",

          {

            caption:
              analyzeCaptionText,

            platform:
              analyzePlatform

          }

        );


      if (
        response.data.success
      ) {

        setAnalysisResult(
          response.data.result
        );

      }


      else {

        setError(
          response.data.error
        );

      }

    }


    catch (err) {

      console.error(err);


      setError(

        err.response?.data?.error ||

        "Unable to analyze caption."

      );

    }


    finally {

      setAnalysisLoading(false);

    }

  };


  // ============================================================
  // COPY
  // ============================================================

  const copyText = async (
    text,
    message = "Copied!"
  ) => {

    try {

      await navigator.clipboard.writeText(
        text
      );

      alert(message);

    }


    catch (error) {

      console.error(
        "Copy failed:",
        error
      );

    }

  };


  // ============================================================
  // COPY HASHTAGS
  // ============================================================

  const copyHashtags = () => {

    if (
      result?.hashtags
    ) {

      copyText(

        result.hashtags.join(" "),

        "Hashtags copied!"

      );

    }

  };


  // ============================================================
  // SCORE COLOR
  // ============================================================

  const getScoreColor = (score) => {

    if (score >= 80) {
      return "text-green-600";
    }

    if (score >= 60) {
      return "text-yellow-600";
    }

    return "text-red-600";

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50">


      {/* ========================================================
          NAVBAR
      ========================================================= */}

      <nav className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-2xl font-bold text-purple-600">

                CaptionCraft AI

              </h1>


              <p className="text-sm text-gray-500">

                AI Social Media Content Assistant

              </p>

            </div>


            <div className="hidden sm:block">

              <span className="text-sm text-gray-500">

                ✨ Generative AI

              </span>

            </div>

          </div>

        </div>

      </nav>


      {/* ========================================================
          HERO
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-8">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-900">

            Create Better Social Media Content

          </h2>


          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">

            Generate, improve, analyze and personalize your
            social media content with Generative AI.

          </p>

        </div>

      </section>


      {/* ========================================================
          MAIN GENERATOR
      ========================================================= */}

      <main className="max-w-7xl mx-auto px-6 pb-12">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          {/* ====================================================
              GENERATOR INPUT
          ==================================================== */}

          <div className="bg-white rounded-2xl border shadow-sm p-7">

            <h3 className="text-xl font-semibold mb-6">

              ✨ Generate Caption

            </h3>


            {/* IMAGE */}

            <div className="mb-6">

              <label className="block text-sm font-medium mb-2">

                Upload Image

              </label>


              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5">

                <input

                  type="file"

                  accept="image/png,image/jpeg,image/jpg,image/webp"

                  onChange={handleImageChange}

                  className="w-full text-sm"

                />


                <p className="text-xs text-gray-400 mt-2">

                  Optional • JPG, PNG, WEBP • Max 10 MB

                </p>

              </div>

            </div>


            {/* PREVIEW */}

            {imagePreview && (

              <div className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium">

                    Image Preview

                  </span>


                  <button

                    onClick={removeImage}

                    className="text-sm text-red-500"

                  >

                    Remove

                  </button>

                </div>


                <img

                  src={imagePreview}

                  alt="Preview"

                  className="w-full max-h-64 object-cover rounded-xl"

                />

              </div>

            )}


            {/* TOPIC */}

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">

                Post Topic

              </label>


              <textarea

                name="topic"

                value={formData.topic}

                onChange={handleChange}

                placeholder="Example: College hackathon"

                rows="4"

                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"

              />

            </div>


            {/* PLATFORM + TONE */}

            <div className="grid grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block text-sm font-medium mb-2">

                  Platform

                </label>


                <select

                  name="platform"

                  value={formData.platform}

                  onChange={handleChange}

                  className="w-full border rounded-xl p-3"

                >

                  <option>Instagram</option>

                  <option>LinkedIn</option>

                  <option>Facebook</option>

                  <option>X</option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">

                  Tone

                </label>


                <select

                  name="tone"

                  value={formData.tone}

                  onChange={handleChange}

                  className="w-full border rounded-xl p-3"

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


            {/* AUDIENCE */}

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">

                Target Audience

              </label>


              <select

                name="audience"

                value={formData.audience}

                onChange={handleChange}

                className="w-full border rounded-xl p-3"

              >

                <option>General</option>

                <option>College Students</option>

                <option>Professionals</option>

                <option>Entrepreneurs</option>

                <option>Customers</option>

                <option>Friends</option>

              </select>

            </div>


            {/* KEYWORDS */}

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">

                Keywords

              </label>


              <input

                type="text"

                name="keywords"

                value={formData.keywords}

                onChange={handleChange}

                placeholder="AI, innovation, teamwork"

                className="w-full border rounded-xl p-3"

              />

            </div>


            {/* LENGTH */}

            <div className="mb-6">

              <label className="block text-sm font-medium mb-2">

                Caption Length

              </label>


              <select

                name="length"

                value={formData.length}

                onChange={handleChange}

                className="w-full border rounded-xl p-3"

              >

                <option>Short</option>

                <option>Medium</option>

                <option>Long</option>

              </select>

            </div>


            {/* ERROR */}

            {error && (

              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                {error}

              </div>

            )}


            {/* BUTTON */}

            <button

              onClick={generateCaption}

              disabled={loading}

              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50"

            >

              {loading

                ? "🤖 Generating..."

                : "✨ Generate Caption"

              }

            </button>

          </div>


          {/* ====================================================
              GENERATOR OUTPUT
          ==================================================== */}

          <div className="bg-white rounded-2xl border shadow-sm p-7">

            <h3 className="text-xl font-semibold mb-6">

              AI Generated Content

            </h3>


            {!result && !loading && (

              <div className="h-[500px] flex items-center justify-center text-center">

                <div>

                  <div className="text-6xl mb-5">

                    ✨

                  </div>


                  <p className="text-gray-500">

                    Your generated content
                    will appear here.

                  </p>

                </div>

              </div>

            )}


            {loading && (

              <div className="h-[500px] flex items-center justify-center text-center">

                <div>

                  <div className="text-6xl animate-pulse mb-5">

                    🤖

                  </div>


                  <p className="font-medium">

                    AI is generating...

                  </p>

                </div>

              </div>

            )}


            {result && !loading && (

              <div className="space-y-6">


                {/* MAIN */}

                <div>

                  <div className="flex justify-between mb-2">

                    <h4 className="font-semibold">

                      📝 Main Caption

                    </h4>


                    <button

                      onClick={() =>
                        copyText(
                          result.caption,
                          "Caption copied!"
                        )
                      }

                      className="text-purple-600 text-sm"

                    >

                      📋 Copy

                    </button>

                  </div>


                  <div className="bg-slate-50 border rounded-xl p-5">

                    {result.caption}

                  </div>

                </div>


                {/* ALTERNATIVES */}

                <div>

                  <h4 className="font-semibold mb-3">

                    💡 Alternatives

                  </h4>


                  <div className="space-y-3">

                    {result.alternatives?.map(

                      (caption, index) => (

                        <div

                          key={index}

                          className="border rounded-xl p-4"

                        >

                          <div className="flex gap-3">

                            <span className="text-purple-600 font-semibold">

                              {index + 1}.

                            </span>


                            <p className="flex-1">

                              {caption}

                            </p>


                            <button

                              onClick={() =>
                                copyText(
                                  caption
                                )
                              }

                            >

                              📋

                            </button>

                          </div>

                        </div>

                      )

                    )}

                  </div>

                </div>


                {/* HASHTAGS */}

                <div>

                  <div className="flex justify-between mb-3">

                    <h4 className="font-semibold">

                      #️⃣ Hashtags

                    </h4>


                    <button

                      onClick={copyHashtags}

                      className="text-purple-600 text-sm"

                    >

                      Copy All

                    </button>

                  </div>


                  <div className="flex flex-wrap gap-2">

                    {result.hashtags?.map(

                      (tag, index) => (

                        <span

                          key={index}

                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"

                        >

                          {tag}

                        </span>

                      )

                    )}

                  </div>

                </div>


                {/* CTA */}

                <div>

                  <h4 className="font-semibold mb-2">

                    🎯 Call to Action

                  </h4>


                  <div className="bg-purple-50 p-4 rounded-xl">

                    {result.call_to_action}

                  </div>

                </div>


                {/* EMOJIS */}

                <div>

                  <h4 className="font-semibold mb-2">

                    😊 Emojis

                  </h4>


                  <div className="text-2xl">

                    {result.emojis?.join(" ")}

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* ======================================================
            CAPTION REWRITER
        ======================================================= */}

        <section className="mt-10">

          <div className="bg-white rounded-2xl border shadow-sm p-7">


            <div className="mb-6">

              <h3 className="text-2xl font-bold">

                ✏️ AI Caption Rewriter

              </h3>


              <p className="text-gray-500 mt-1">

                Improve an existing caption using Generative AI.

              </p>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


              {/* INPUT */}

              <div>

                <label className="block text-sm font-medium mb-2">

                  Existing Caption

                </label>


                <textarea

                  value={originalCaption}

                  onChange={(event) =>
                    setOriginalCaption(
                      event.target.value
                    )
                  }

                  placeholder="Paste your existing social media caption here..."

                  rows="8"

                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"

                />


                <div className="grid grid-cols-2 gap-4 mt-4">


                  <div>

                    <label className="block text-sm font-medium mb-2">

                      Rewrite Style

                    </label>


                    <select

                      value={rewriteStyle}

                      onChange={(event) =>
                        setRewriteStyle(
                          event.target.value
                        )
                      }

                      className="w-full border rounded-xl p-3"

                    >

                      <option>
                        Make More Engaging
                      </option>

                      <option>
                        Make Professional
                      </option>

                      <option>
                        Make Funny
                      </option>

                      <option>
                        Make Inspirational
                      </option>

                      <option>
                        Make Shorter
                      </option>

                      <option>
                        Add Emojis
                      </option>

                    </select>

                  </div>


                  <div>

                    <label className="block text-sm font-medium mb-2">

                      Platform

                    </label>


                    <select

                      value={rewritePlatform}

                      onChange={(event) =>
                        setRewritePlatform(
                          event.target.value
                        )
                      }

                      className="w-full border rounded-xl p-3"

                    >

                      <option>
                        Instagram
                      </option>

                      <option>
                        LinkedIn
                      </option>

                      <option>
                        Facebook
                      </option>

                      <option>
                        X
                      </option>

                    </select>

                  </div>

                </div>


                <button

                  onClick={handleRewrite}

                  disabled={rewriteLoading}

                  className="w-full mt-5 bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl disabled:opacity-50"

                >

                  {rewriteLoading

                    ? "🤖 Rewriting..."

                    : "✏️ Rewrite Caption"

                  }

                </button>

              </div>


              {/* OUTPUT */}

              <div>

                <h4 className="font-semibold mb-3">

                  AI Improved Caption

                </h4>


                {!rewriteResult &&
                  !rewriteLoading && (

                    <div className="h-72 bg-slate-50 border rounded-xl flex items-center justify-center text-gray-400 text-center p-6">

                      Your rewritten caption
                      will appear here.

                    </div>

                  )}


                {rewriteLoading && (

                  <div className="h-72 bg-slate-50 border rounded-xl flex items-center justify-center text-center">

                    <div>

                      <div className="text-5xl animate-pulse mb-4">

                        ✨

                      </div>


                      <p>

                        AI is improving your caption...

                      </p>

                    </div>

                  </div>

                )}


                {rewriteResult &&
                  !rewriteLoading && (

                    <div className="space-y-5">


                      {/* REWRITTEN */}

                      <div>

                        <div className="flex justify-between mb-2">

                          <span className="font-semibold">

                            ✨ Rewritten Caption

                          </span>


                          <button

                            onClick={() =>
                              copyText(
                                rewriteResult.rewritten_caption,
                                "Caption copied!"
                              )
                            }

                            className="text-purple-600 text-sm"

                          >

                            📋 Copy

                          </button>

                        </div>


                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">

                          {
                            rewriteResult.rewritten_caption
                          }

                        </div>

                      </div>


                      {/* ALTERNATIVES */}

                      <div>

                        <h4 className="font-semibold mb-3">

                          Alternative Versions

                        </h4>


                        <div className="space-y-2">

                          {rewriteResult.alternative_versions?.map(

                            (version, index) => (

                              <div

                                key={index}

                                className="border rounded-xl p-3"

                              >

                                {version}

                              </div>

                            )

                          )}

                        </div>

                      </div>


                      {/* HASHTAGS */}

                      <div>

                        <h4 className="font-semibold mb-2">

                          Suggested Hashtags

                        </h4>


                        <div className="flex flex-wrap gap-2">

                          {rewriteResult.hashtags?.map(

                            (tag, index) => (

                              <span

                                key={index}

                                className="bg-gray-100 px-3 py-1 rounded-full text-sm"

                              >

                                {tag}

                              </span>

                            )

                          )}

                        </div>

                      </div>

                    </div>

                  )}

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            CAPTION QUALITY ANALYZER
        ======================================================= */}

        <section className="mt-10">

          <div className="bg-white rounded-2xl border shadow-sm p-7">


            <div className="mb-6">

              <h3 className="text-2xl font-bold">

                📊 Caption Quality & Engagement Analyzer

              </h3>


              <p className="text-gray-500 mt-1">

                Analyze your caption and discover how to improve
                its quality and engagement potential.

              </p>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


              {/* ==================================================
                  ANALYZER INPUT
              ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">

                  Caption to Analyze

                </label>


                <textarea

                  value={analyzeCaptionText}

                  onChange={(event) =>
                    setAnalyzeCaptionText(
                      event.target.value
                    )
                  }

                  placeholder="Paste your social media caption here..."

                  rows="10"

                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"

                />


                <div className="mt-4">

                  <label className="block text-sm font-medium mb-2">

                    Platform

                  </label>


                  <select

                    value={analyzePlatform}

                    onChange={(event) =>
                      setAnalyzePlatform(
                        event.target.value
                      )
                    }

                    className="w-full border rounded-xl p-3"

                  >

                    <option>
                      Instagram
                    </option>

                    <option>
                      LinkedIn
                    </option>

                    <option>
                      Facebook
                    </option>

                    <option>
                      X
                    </option>

                  </select>

                </div>


                <button

                  onClick={handleAnalyzeCaption}

                  disabled={analysisLoading}

                  className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50"

                >

                  {analysisLoading

                    ? "🤖 Analyzing..."

                    : "📊 Analyze Caption"

                  }

                </button>

              </div>


              {/* ==================================================
                  ANALYZER OUTPUT
              ================================================== */}

              <div>

                {!analysisResult &&
                  !analysisLoading && (

                    <div className="h-full min-h-[420px] bg-slate-50 border rounded-xl flex items-center justify-center text-center text-gray-400 p-6">

                      <div>

                        <div className="text-6xl mb-5">

                          📊

                        </div>


                        <p>

                          Your caption analysis
                          will appear here.

                        </p>

                      </div>

                    </div>

                  )}


                {analysisLoading && (

                  <div className="h-full min-h-[420px] bg-slate-50 border rounded-xl flex items-center justify-center text-center">

                    <div>

                      <div className="text-6xl animate-pulse mb-5">

                        🤖

                      </div>


                      <p className="font-medium">

                        AI is analyzing your caption...

                      </p>

                    </div>

                  </div>

                )}


                {analysisResult &&
                  !analysisLoading && (

                    <div className="space-y-5">


                      {/* SCORE */}

                      <div className="border rounded-2xl p-6 text-center">

                        <p className="text-sm text-gray-500 mb-2">

                          Overall Caption Score

                        </p>


                        <div
                          className={`text-6xl font-bold ${getScoreColor(
                            Number(analysisResult.score)
                          )}`}
                        >

                          {analysisResult.score}

                          <span className="text-2xl text-gray-400">

                            /100

                          </span>

                        </div>


                        <div className="mt-3">

                          <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">

                            {analysisResult.grade}

                          </span>

                        </div>

                      </div>


                      {/* METRICS */}

                      <div className="grid grid-cols-2 gap-3">


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Readability

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.readability}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Tone

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.tone}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Engagement

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.engagement}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Hook

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.hook}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Call to Action

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.cta}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Hashtags

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.hashtag_quality}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Clarity

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.clarity}

                          </p>

                        </div>


                        <div className="bg-slate-50 border rounded-xl p-4">

                          <p className="text-xs text-gray-500">

                            Audience Appeal

                          </p>

                          <p className="font-semibold mt-1">

                            {analysisResult.audience_appeal}

                          </p>

                        </div>

                      </div>


                      {/* SUGGESTIONS */}

                      <div>

                        <h4 className="font-semibold mb-3">

                          💡 AI Improvement Suggestions

                        </h4>


                        <div className="space-y-3">

                          {analysisResult.suggestions?.map(

                            (suggestion, index) => (

                              <div

                                key={index}

                                className="flex gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4"

                              >

                                <span className="text-purple-600 font-bold">

                                  {index + 1}

                                </span>


                                <p className="text-gray-700">

                                  {suggestion}

                                </p>

                              </div>

                            )

                          )}

                        </div>

                      </div>

                    </div>

                  )}

              </div>

            </div>

          </div>

        </section>
        <RagGenerator />
        {/* History Section */}
        <History />
      </main>


      {/* ========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t bg-white py-6">

        <p className="text-center text-sm text-gray-400">

          CaptionCraft AI • Generative AI Social Media Assistant

        </p>

      </footer>

    </div>

  );

}


export default App;