import React from "react";

export function SparkleIcon({ className = "w-10 h-10" }) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Image card gradient (landscape sky) */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          {/* AI chip gradient */}
          <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          {/* Speech bubble gradient */}
          <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
          {/* Pencil body gradient */}
          <linearGradient id="pencilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          {/* Gold sparkle gradient */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          {/* Card shadow filter */}
          <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.25" />
          </filter>
          <filter id="chipShadow" x="-15%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4c1d95" floodOpacity="0.4" />
          </filter>
          <clipPath id="cardClip">
            <rect x="12" y="14" width="64" height="54" rx="9" />
          </clipPath>
        </defs>

        {/* ── Image card (background) ── */}
        <rect x="12" y="14" width="64" height="54" rx="9" fill="url(#skyGrad)" filter="url(#cardShadow)" />
        {/* Mountain silhouette inside card */}
        <polygon points="12,52 28,34 40,44 52,28 64,40 76,30 76,68 12,68" fill="#1e3a5f" clipPath="url(#cardClip)" />
        <polygon points="12,58 30,42 44,52 56,36 70,46 76,38 76,68 12,68" fill="#0f172a" clipPath="url(#cardClip)" />
        {/* Sun */}
        <circle cx="57" cy="29" r="5" fill="#fbbf24" clipPath="url(#cardClip)" />
        {/* Card border */}
        <rect x="12" y="14" width="64" height="54" rx="9" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* ── Speech bubble (foreground) ── */}
        <rect x="20" y="55" width="52" height="36" rx="8" fill="url(#bubbleGrad)" filter="url(#cardShadow)" />
        {/* Bubble tail */}
        <polygon points="30,91 24,100 40,91" fill="#ddd6fe" />
        {/* Text lines */}
        <rect x="27" y="63" width="38" height="3.5" rx="1.75" fill="#7c3aed" opacity="0.6" />
        <rect x="27" y="71" width="30" height="3.5" rx="1.75" fill="#7c3aed" opacity="0.5" />
        <rect x="27" y="79" width="34" height="3.5" rx="1.75" fill="#7c3aed" opacity="0.4" />

        {/* ── AI Chip ── */}
        {/* Chip pins - left */}
        <rect x="6" y="19" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        <rect x="6" y="24" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        <rect x="6" y="29" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        {/* Chip pins - right */}
        <rect x="33" y="19" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        <rect x="33" y="24" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        <rect x="33" y="29" width="7" height="2.5" rx="1.25" fill="#c4b5fd" />
        {/* Chip pins - top */}
        <rect x="14" y="6" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        <rect x="19" y="6" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        <rect x="24" y="6" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        {/* Chip pins - bottom */}
        <rect x="14" y="33" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        <rect x="19" y="33" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        <rect x="24" y="33" width="2.5" height="7" rx="1.25" fill="#c4b5fd" />
        {/* Chip body */}
        <rect x="12" y="11" width="22" height="22" rx="5" fill="url(#chipGrad)" filter="url(#chipShadow)" />
        <rect x="12" y="11" width="22" height="22" rx="5" fill="none" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.5" />
        {/* AI text */}
        <text x="23" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" fill="white" letterSpacing="-0.5">AI</text>

        {/* ── Pencil ── */}
        {/* Pencil body (rotated ~-40deg, bottom-right area) */}
        <g transform="rotate(-40 80 80)">
          {/* Eraser */}
          <rect x="73" y="52" width="9" height="5" rx="2" fill="#fbbf24" />
          {/* Gold band */}
          <rect x="73" y="57" width="9" height="3" fill="#d97706" />
          {/* Pencil body */}
          <rect x="73" y="60" width="9" height="28" fill="url(#pencilGrad)" />
          {/* Wood tip */}
          <polygon points="73,88 82,88 77.5,98" fill="#fde68a" />
          {/* Lead tip */}
          <polygon points="75,94 80,94 77.5,98" fill="#1e293b" />
        </g>

        {/* ── Gold sparkles (top-right) ── */}
        {/* Large sparkle */}
        <path
          d="M97 14 C97 20 101 24 107 24 C101 24 97 28 97 34 C97 28 93 24 87 24 C93 24 97 20 97 14 Z"
          fill="url(#goldGrad)"
        />
        {/* Small sparkle */}
        <path
          d="M108 28 C108 31 110 33 113 33 C110 33 108 35 108 38 C108 35 106 33 103 33 C106 33 108 31 108 28 Z"
          fill="url(#goldGrad)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export default function BrandLogo({ size = "md", showSubtitle = true, centered = false }) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className={`flex items-center gap-3.5 select-none ${centered ? "justify-center" : ""}`}>
      <SparkleIcon
        className={
          isLg
            ? "w-14 h-14"
            : isSm
            ? "w-8 h-8"
            : "w-10 h-10"
        }
      />
      <div className={centered ? "text-center" : "text-left"}>
        <div className="flex items-center tracking-tight leading-none">
          <span
            className={`font-black tracking-tight text-slate-900 ${
              isLg ? "text-2xl sm:text-3xl" : isSm ? "text-base" : "text-xl sm:text-2xl"
            }`}
          >
            CaptionCraft
          </span>
          <span
            className={`font-black tracking-tight ml-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ${
              isLg ? "text-2xl sm:text-3xl" : isSm ? "text-base" : "text-xl sm:text-2xl"
            }`}
          >
            AI
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`font-medium tracking-normal text-slate-500 mt-1 ${
              isLg ? "text-sm sm:text-base" : isSm ? "text-[10px]" : "text-xs"
            }`}
          >
            AI Social Media Content Assistant
          </p>
        )}
      </div>
    </div>
  );
}

