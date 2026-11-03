import React, { useState } from "react";
import {
  CoffeeIcon,
  BriefcaseIcon,
  SmileIcon,
  StarIcon,
  RocketIcon,
  TagIcon,
  TargetIcon,
  HandshakeIcon,
  DiceIcon,
  XIcon,
  ImageIcon
} from "./Icons";

// Platform icons & styling
export const PLATFORM_CONFIG = {
  Instagram: {
    name: "Instagram",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
    badgeClass: "bg-pink-50 text-pink-700 border-pink-200/60",
    gradient: "from-pink-500 via-purple-500 to-amber-500",
    maxChars: 2200
  },
  LinkedIn: {
    name: "LinkedIn",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/60",
    gradient: "from-blue-600 to-indigo-600",
    maxChars: 3000
  },
  Facebook: {
    name: "Facebook",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    gradient: "from-blue-600 to-blue-800",
    maxChars: 2000
  },
  X: {
    name: "X",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    badgeClass: "bg-slate-100 text-slate-800 border-slate-300/60",
    gradient: "from-slate-700 to-slate-900",
    maxChars: 280
  },
  YouTube: {
    name: "YouTube",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
        <polygon points="10 15 15 12 10 9 10 15"/>
      </svg>
    ),
    badgeClass: "bg-red-50 text-red-700 border-red-200/60",
    gradient: "from-red-500 to-rose-600",
    maxChars: 5000
  }
};

export const TONE_CONFIG = {
  Casual: { icon: <CoffeeIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Casual", desc: "Friendly & relaxed" },
  Professional: { icon: <BriefcaseIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Professional", desc: "Authoritative & clear" },
  Funny: { icon: <SmileIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Funny", desc: "Witty & entertaining" },
  Inspirational: { icon: <StarIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Inspirational", desc: "Uplifting & motivational" },
  Exciting: { icon: <RocketIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Exciting", desc: "High energy & hype" },
  Promotional: { icon: <TagIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Promotional", desc: "Conversion focused" },
  Persuasive: { icon: <TargetIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Persuasive", desc: "Action oriented" },
  Friendly: { icon: <HandshakeIcon className="w-3.5 h-3.5 text-purple-600" />, label: "Friendly", desc: "Warm & welcoming" }
};

// Creative prompts to spark inspiration (no emojis)
export const CREATIVE_PROMPT_PRESETS = [
  "Announcing our breakthrough AI tool: 50% faster, built for modern teams",
  "Top 3 lessons learned scaling our startup from 0 to 10k users in 6 months",
  "Aesthetic coffee corner vlog reel — quiet morning rituals and creative focus",
  "Before & After: 30 days of consistent fitness transformation and clean nutrition",
  "Behind the scenes of our creative studio workspace redesign",
  "Why most people fail at personal branding on LinkedIn (and how to fix it)",
  "Weekend getaway guide to the hidden gems of Kyoto",
  "Flash Sale: 40% OFF all digital creator bundles this weekend only!"
];

/**
 * INSANE TEXTAREA COMPONENT
 */
export function InsaneTextArea({
  value,
  onChange,
  onKeyDown,
  placeholder = "What is your post about? Type your core idea, hook, or story...",
  label = "Post Topic or Idea",
  platform = "Instagram",
  rows = 4,
  name = "topic",
  disabled = false,
  helperText
}) {
  const [isFocused, setIsFocused] = useState(false);
  const maxLimit = PLATFORM_CONFIG[platform]?.maxChars || 2200;
  const currentLength = (value || "").length;
  const isNearLimit = currentLength > maxLimit * 0.85;

  const handleSurprise = () => {
    const randomPrompt = CREATIVE_PROMPT_PRESETS[Math.floor(Math.random() * CREATIVE_PROMPT_PRESETS.length)];
    onChange({ target: { name, value: randomPrompt } });
  };

  const handleAppendSnippet = (snippet) => {
    const updated = value ? `${value.trim()} ${snippet}` : snippet;
    onChange({ target: { name, value: updated } });
  };

  const handleClear = () => {
    onChange({ target: { name, value: "" } });
  };

  return (
    <div className="w-full space-y-2">
      {/* Top Meta Header */}
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          {label}
        </label>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 transition font-medium flex items-center gap-1"
            >
              <span>Clear</span>
              <XIcon className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={handleSurprise}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 font-semibold transition"
          >
            <DiceIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>

      {/* Insane Container */}
      <div
        className={`relative rounded-2xl transition-all duration-300 border bg-gradient-to-b from-white via-white to-slate-50/60 ${
          isFocused
            ? "border-purple-400 ring-4 ring-purple-500/10 shadow-[0_10px_25px_-5px_rgba(124,58,237,0.12)]"
            : "border-slate-200/80 hover:border-slate-300 shadow-sm"
        }`}
      >
        {/* Text Area */}
        <textarea
          name={name}
          rows={rows}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent p-4 pb-2 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none leading-relaxed"
        />

        {/* Bottom Interactive Toolbar inside input */}
        <div className="px-4 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white/60 rounded-b-2xl">
          {/* Quick injection chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-0.5">Quick add:</span>
            <button
              type="button"
              onClick={() => handleAppendSnippet("What do you think? Drop your thoughts below")}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100/90 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition border border-slate-200/50"
            >
              + CTA Question
            </button>
            <button
              type="button"
              onClick={() => handleAppendSnippet("Limited time only. Do not miss out.")}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100/90 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition border border-slate-200/50"
            >
              + Urgency
            </button>
            <button
              type="button"
              onClick={() => handleAppendSnippet("Link in bio for full details.")}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100/90 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition border border-slate-200/50"
            >
              + Link in Bio
            </button>
          </div>

          {/* Right counter & indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium ${
                isNearLimit ? "text-amber-600 font-semibold" : "text-slate-400"
              }`}
            >
              {currentLength} / {maxLimit}
            </span>
          </div>
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-400 pl-1">{helperText}</p>}
    </div>
  );
}

/**
 * INSANE PLATFORM SELECTOR
 */
export function InsanePlatformSelector({ selected, onSelect, platforms = ["Instagram", "LinkedIn", "Facebook", "X"] }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">Target Social Platform</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {platforms.map((p) => {
          const isSelected = selected === p;
          const conf = PLATFORM_CONFIG[p] || { icon: null };
          return (
            <button
              key={p}
              type="button"
              onClick={() => onSelect(p)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 scale-[1.02]"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <span className={isSelected ? "text-white" : "text-slate-500"}>{conf.icon}</span>
              <span>{p}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * INSANE TONE SELECTOR
 */
export function InsaneToneSelector({ selected, onSelect, tones = ["Casual", "Professional", "Funny", "Inspirational", "Exciting", "Promotional"] }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">Voice & Tone Aesthetic</label>
      <div className="flex flex-wrap gap-1.5">
        {tones.map((t) => {
          const isSelected = selected === t;
          const conf = TONE_CONFIG[t] || { icon: null, label: t };
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                isSelected
                  ? "bg-gradient-to-r from-violet-50 to-purple-50 text-purple-800 border-purple-300 shadow-sm ring-1 ring-purple-300 font-bold"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80"
              }`}
            >
              <span>{conf.icon}</span>
              <span>{t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * INSANE SEGMENTED CONTROL
 */
export function InsaneSegmented({ label, options, selected, onSelect }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all duration-150 truncate ${
                isSelected
                  ? "bg-white text-purple-700 font-semibold shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * INSANE IMAGE DROPZONE
 */
export function InsaneImageDropzone({ image, preview, onImageChange, onRemove }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-purple-600" />
          <span>Visual Content Context</span>
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        {preview && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition flex items-center gap-1"
          >
            <span>Remove Image</span>
            <XIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {!preview ? (
        <label className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-purple-300 bg-white/70 hover:bg-purple-50/20 rounded-2xl cursor-pointer transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-700 mb-0.5">
            Drop your image here or <span className="text-purple-600 underline">browse</span>
          </p>
          <p className="text-[11px] text-slate-400">JPG, PNG, WEBP · Up to 10 MB · Multi-modal AI Analysis</p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 group shadow-md">
          <img src={preview} alt="Upload preview" className="w-full max-h-56 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-between p-3">
            <span className="text-xs text-white font-medium truncate max-w-[200px]">
              {image?.name || "Image Attached"}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="bg-rose-500/90 hover:bg-rose-600 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm transition flex items-center gap-1"
            >
              <span>Remove</span>
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
