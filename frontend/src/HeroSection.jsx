import React, { useState } from "react";
import {
  RocketIcon,
  BriefcaseIcon,
  CoffeeIcon,
  StarIcon,
  SparklesIcon,
  ZapIcon
} from "./Icons";

const SAMPLE_POSTS = {
  Instagram: {
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    name: "Elena Vance",
    handle: "@elenacreates",
    time: "Just now",
    caption: "Stop waiting for the 'perfect moment' to start. The courage comes AFTER you take the leap, not before. 3 months ago I almost scrapped this project, today we hit our biggest milestone yet. Never trade consistency for temporary comfort. What goal are you chasing this week?",
    hashtags: ["#CreatorMindset", "#BuildInPublic", "#ConsistencyWins", "#CreativeJourney"],
    likes: "3,428",
    comments: "184",
    viralityScore: 98,
    badge: "High Engagement Potential"
  },
  LinkedIn: {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    name: "Marcus Sterling",
    handle: "Product Lead @ CloudNova",
    time: "1h • Edited",
    caption: "Most AI tools focus on volume. The real competitive moat in 2026 is contextual precision. Here is how our engineering team increased social conversion by 340% without increasing post frequency:\n\n1. Dynamic audience tone alignment\n2. Real-time hook testing\n3. Grounding outputs in verified company knowledge (RAG)\n\nQuality will always outperform noise.",
    hashtags: ["#ArtificialIntelligence", "#ProductStrategy", "#Leadership", "#GrowthHacking"],
    likes: "1,892",
    comments: "312",
    viralityScore: 96,
    badge: "Thought Leadership Rating: A+"
  },
  X: {
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    name: "Sarah Chen",
    handle: "@sarah_builds",
    time: "24m",
    caption: "shipped the new AI feature at 2 AM. woke up to 1,200 new users.\n\nthe secret isn't fancy marketing. it's writing captions that speak directly to what people were already struggling with.\n\nsimple hook + clear value + zero fluff. that's the whole formula.",
    hashtags: ["#buildinpublic", "#indiehackers", "#ai"],
    likes: "940",
    comments: "88",
    viralityScore: 94,
    badge: "High Retweet Probability"
  }
};

const INSPIRATION_PILLS = [
  { icon: <RocketIcon className="w-3.5 h-3.5 text-purple-600" />, title: "Product Launch", prompt: "Announcing our breakthrough AI tool designed for creators who value speed and craft" },
  { icon: <BriefcaseIcon className="w-3.5 h-3.5 text-purple-600" />, title: "Founder Milestone", prompt: "Reflecting on 1 year of bootstrapping: 5 hard lessons about growth and grit" },
  { icon: <StarIcon className="w-3.5 h-3.5 text-purple-600" />, title: "Travel Story", prompt: "Sunrise over the Amalfi coast — why stepping away from the desk makes you 10x more creative" },
  { icon: <CoffeeIcon className="w-3.5 h-3.5 text-purple-600" />, title: "Coffee & Focus", prompt: "Quiet mornings, warm pour-over, and a notebook full of ideas before the notifications hit" },
  { icon: <ZapIcon className="w-3.5 h-3.5 text-purple-600" />, title: "Fitness Win", prompt: "Day 60 of staying consistent even when motivation vanished. Here is what shifted" }
];

export default function HeroSection({ onSelectPrompt, onGetStarted }) {
  const [activePlatform, setActivePlatform] = useState("Instagram");
  const post = SAMPLE_POSTS[activePlatform];

  return (
    <section className="relative pt-6 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Soft Ambient Light Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-10 right-1/4 w-[28rem] h-[28rem] bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-48 left-1/3 w-80 h-80 bg-violet-100/30 rounded-full blur-2xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm shadow-purple-500/5 text-xs font-semibold text-purple-900 tracking-wide">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
            </span>
            <span className="text-purple-700 font-bold">NEXT-GEN SOCIAL AI ENGINE 3.0</span>
            <span className="text-purple-300">|</span>
            <span className="text-slate-600 font-medium">Prompt to High-Converting Captions in Seconds</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Craft Magnetic Social Captions{" "}
            <span className="block mt-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              That Convert & Inspire
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The intelligent studio for creators and modern brands. Generate viral hooks, adapt across 5+ platforms, rewrite for maximum engagement, and ground captions in your own knowledge base.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Start Crafting Free</span>
            </button>
            <a
              href="#interactive-studio"
              className="px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 font-semibold text-sm border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore Interactive Studio</span>

              <img
                src="/icons.svg#chevron-down"
                alt=""
                className="w-4 h-4"
              />
            </a>
          </div>
          {/* Quick Inspiration Prompts */}
          <div className="mt-8 pt-6 border-t border-slate-200/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Instant Inspirations · Click to test:
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {INSPIRATION_PILLS.map((pill) => (
                <button
                  key={pill.title}
                  onClick={() => onSelectPrompt?.(pill.prompt)}
                  className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-purple-50/90 text-slate-700 hover:text-purple-700 text-xs font-medium border border-slate-200/70 hover:border-purple-300 shadow-sm transition-all duration-200"
                >
                  <span>{pill.icon}</span>
                  <span>{pill.title}</span>
                  <span className="text-slate-300 group-hover:text-purple-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Realistic Social Live Preview Mockup Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-purple-200/60 via-white to-purple-100/40 shadow-xl shadow-purple-900/5">
            <div className="bg-white/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-7 border border-white">
              {/* Card Header & Platform Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Mockup:</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {post.badge}
                  </span>
                </div>

                <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                  {["Instagram", "LinkedIn", "X"].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setActivePlatform(plat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${activePlatform === plat
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock Social Feed Post */}
              <div className="pt-5 space-y-4">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">{post.name}</span>

                        <img
                          src="/icons.svg"
                          alt="Verified"
                          className="w-4 h-4"
                        />
                      </div>

                      <p className="text-xs text-slate-400 font-medium">
                        {post.handle} · {post.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200/60">
                    <ZapIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>Score:</span>
                    <span>{post.viralityScore}/100</span>
                  </div>
                </div>

                {/* Caption Text */}
                <div className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {post.caption}
                </div>

                {/* Hashtag Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-purple-50/80 text-purple-700 border border-purple-100/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Engagement Metrics Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <strong>{post.likes}</strong> Likes
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <strong>{post.comments}</strong> Comments
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700 hidden sm:flex">
                      <strong>+340%</strong> Reach
                    </span>
                  </div>

                  <span className="text-[11px] text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    AI Generated Sample
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Impact Statistics Ribbon */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {[
            { metric: "100K+", label: "Captions Generated", sub: "For creators & founders" },
            { metric: "99.4%", label: "Voice Precision", sub: "Context-aligned tone matching" },
            { metric: "5+", label: "Social Platforms", sub: "Instagram, LinkedIn, X, FB, YT" },
            { metric: "< 1.2s", label: "Ultra-Fast Latency", sub: "Gemini 2.5 Flash Engine" }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-sm text-center hover:border-purple-200 transition-all duration-200"
            >
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {stat.metric}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
