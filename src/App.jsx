import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Play, Pause, Upload, Download, Type, Palette, Move, Sparkles, Clock,
  Check, X, ChevronRight, Film, Scissors, Plus, Trash2, Wand2,
  ShieldCheck, Menu, ArrowRight, Layers, Settings2, Copy
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  FONT IMPORTS                                                       */
/* ------------------------------------------------------------------ */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Bebas+Neue&family=Space+Grotesk:wght@500;600;700&display=swap');

    .font-display { font-family: 'Fraunces', Georgia, serif; }
    .font-body { font-family: 'Manrope', -apple-system, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-bebas { font-family: 'Bebas Neue', sans-serif; }
    .font-grotesk { font-family: 'Space Grotesk', sans-serif; }

    @keyframes jp-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes jp-pop { 0% { opacity: 0; transform: scale(0.7); } 60% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes jp-slide { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes jp-bounce { 0% { opacity: 0; transform: translateY(-18px); } 50% { transform: translateY(4px); } 70% { transform: translateY(-2px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes jp-glow { 0%,100% { text-shadow: 0 0 6px currentColor; } 50% { text-shadow: 0 0 16px currentColor; } }
    @keyframes jp-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes jp-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

    .jp-anim-fade { animation: jp-fade 0.35s ease both; }
    .jp-anim-pop { animation: jp-pop 0.4s cubic-bezier(.2,.9,.3,1.3) both; }
    .jp-anim-slide { animation: jp-slide 0.35s ease both; }
    .jp-anim-bounce { animation: jp-bounce 0.5s cubic-bezier(.34,1.56,.64,1) both; }

    .jp-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .jp-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2c; border-radius: 3px; }
    .jp-scrollbar::-webkit-scrollbar-track { background: transparent; }

    input[type=range].jp-range { -webkit-appearance: none; height: 3px; background: #2a2a28; border-radius: 2px; }
    input[type=range].jp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #C9A227; cursor: pointer; border: 2px solid #0B0B0C; }
    input[type=color] { -webkit-appearance: none; border: none; padding: 0; background: none; }
    input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
    input[type=color]::-webkit-color-swatch { border: 1px solid #2a2a28; border-radius: 6px; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  TEMPLATE LIBRARY                                                   */
/* ------------------------------------------------------------------ */
const FONTS = {
  serif: "'Fraunces', Georgia, serif",
  body: "'Manrope', sans-serif",
  bebas: "'Bebas Neue', sans-serif",
  grotesk: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
  system: "Arial, Helvetica, sans-serif",
  condensed: "'Space Grotesk', Impact, sans-serif",
};

const T = (o) => ({
  fontSize: 30, fontWeight: 700, letterSpacing: 0, lineHeight: 1.25,
  textColor: "#F5F1E8", highlightColor: "#C9A227", bgColor: "#000000",
  position: "bottom", animation: "fade", stroke: false, strokeColor: "#000000",
  shadow: true, box: false, rounded: false, blur: false, boxOpacity: 0.55,
  ...o,
});

const TEMPLATES = [
  // Minimal
  { id: "min-clean", name: "Clean", category: "Minimal", ...T({ font: FONTS.body, fontWeight: 600, textColor: "#FFFFFF", highlightColor: "#C9A227", shadow: true, animation: "fade" }) },
  { id: "min-simple", name: "Simple", category: "Minimal", ...T({ font: FONTS.body, fontWeight: 500, fontSize: 26, textColor: "#EDEAE2", highlightColor: "#EDEAE2", shadow: false, box: true, boxOpacity: 0.4, rounded: true, animation: "fade" }) },
  { id: "min-modern", name: "Modern", category: "Minimal", ...T({ font: FONTS.grotesk, fontWeight: 600, textColor: "#FFFFFF", highlightColor: "#8FE3CF", letterSpacing: 0.5, animation: "slide" }) },
  { id: "min-elegant", name: "Elegant", category: "Minimal", ...T({ font: FONTS.serif, fontWeight: 500, textColor: "#F5F1E8", highlightColor: "#C9A227", fontSize: 28, animation: "fade" }) },
  // Cinematic
  { id: "cin-movie", name: "Movie", category: "Cinematic", ...T({ font: FONTS.serif, fontWeight: 500, textColor: "#F5F1E8", highlightColor: "#C9A227", position: "bottom", box: true, boxOpacity: 0.5, animation: "fade", fontSize: 27 }) },
  { id: "cin-film", name: "Film", category: "Cinematic", ...T({ font: FONTS.serif, fontWeight: 600, fontSize: 25, textColor: "#EDEAE2", stroke: true, strokeColor: "#000000", animation: "fade" }) },
  { id: "cin-dramatic", name: "Dramatic", category: "Cinematic", ...T({ font: FONTS.serif, fontWeight: 700, fontSize: 34, textColor: "#FFFFFF", highlightColor: "#E2574C", shadow: true, animation: "pop" }) },
  { id: "cin-doc", name: "Documentary", category: "Cinematic", ...T({ font: FONTS.body, fontWeight: 500, fontSize: 24, textColor: "#F5F1E8", box: true, boxOpacity: 0.6, position: "bottom", animation: "slide" }) },
  // Social
  { id: "soc-reels", name: "Reels", category: "Social Media", ...T({ font: FONTS.grotesk, fontWeight: 800, fontSize: 34, textColor: "#FFFFFF", highlightColor: "#C9A227", stroke: true, position: "center", animation: "pop" }) },
  { id: "soc-tiktok", name: "TikTok", category: "Social Media", ...T({ font: FONTS.grotesk, fontWeight: 800, fontSize: 32, textColor: "#FFFFFF", highlightColor: "#8FE3CF", stroke: true, strokeColor: "#000000", position: "center", animation: "bounce" }) },
  { id: "soc-shorts", name: "Shorts", category: "Social Media", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#FFFFFF", highlightColor: "#E2574C", box: true, rounded: true, boxOpacity: 0.65, animation: "pop" }) },
  { id: "soc-viral", name: "Viral", category: "Social Media", ...T({ font: FONTS.bebas, fontWeight: 400, fontSize: 40, letterSpacing: 1, textColor: "#FFFFFF", highlightColor: "#C9A227", stroke: true, position: "center", animation: "bounce" }) },
  // Podcast
  { id: "pod-classic", name: "Podcast Classic", category: "Podcast", ...T({ font: FONTS.body, fontWeight: 600, fontSize: 26, textColor: "#F5F1E8", box: true, boxOpacity: 0.55, rounded: true, animation: "fade" }) },
  { id: "pod-bold", name: "Podcast Bold", category: "Podcast", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#FFFFFF", highlightColor: "#C9A227", box: true, boxOpacity: 0.7, animation: "slide" }) },
  { id: "pod-dynamic", name: "Podcast Dynamic", category: "Podcast", ...T({ font: FONTS.grotesk, fontWeight: 600, fontSize: 28, textColor: "#EDEAE2", highlightColor: "#8FE3CF", animation: "wordHighlight" }) },
  // Gaming
  { id: "gam-gamer", name: "Gamer", category: "Gaming", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#F5F1E8", highlightColor: "#8FE3CF", stroke: true, strokeColor: "#0B0B0C", animation: "pop" }) },
  { id: "gam-energy", name: "Energy", category: "Gaming", ...T({ font: FONTS.bebas, fontWeight: 400, fontSize: 36, textColor: "#FFFFFF", highlightColor: "#E2574C", stroke: true, animation: "bounce" }) },
  { id: "gam-rgb", name: "RGB Inspired", category: "Gaming", ...T({ font: FONTS.grotesk, fontWeight: 800, fontSize: 30, textColor: "#FFFFFF", highlightColor: "#8FE3CF", animation: "wordHighlight" }) },
  { id: "gam-dynamic", name: "Dynamic", category: "Gaming", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 28, textColor: "#F5F1E8", highlightColor: "#C9A227", box: true, boxOpacity: 0.5, animation: "slide" }) },
  // Bold
  { id: "bold-impact", name: "Big Impact", category: "Bold", ...T({ font: FONTS.bebas, fontWeight: 400, fontSize: 42, textColor: "#FFFFFF", highlightColor: "#C9A227", stroke: true, position: "center", animation: "pop" }) },
  { id: "bold-heavy", name: "Heavy", category: "Bold", ...T({ font: FONTS.grotesk, fontWeight: 800, fontSize: 34, textColor: "#FFFFFF", box: true, boxOpacity: 0.8, animation: "bounce" }) },
  { id: "bold-punch", name: "Punch", category: "Bold", ...T({ font: FONTS.bebas, fontWeight: 400, fontSize: 38, textColor: "#0B0B0C", box: true, boxOpacity: 1, rounded: true, animation: "pop" }) },
  { id: "bold-statement", name: "Statement", category: "Bold", ...T({ font: FONTS.serif, fontWeight: 700, fontSize: 32, textColor: "#FFFFFF", highlightColor: "#E2574C", shadow: true, animation: "slide" }) },
  // Karaoke
  { id: "kar-word", name: "Word Highlight", category: "Karaoke", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#8A867C", highlightColor: "#C9A227", animation: "wordHighlight" }) },
  { id: "kar-beat", name: "Beat Highlight", category: "Karaoke", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#EDEAE2", highlightColor: "#8FE3CF", animation: "wordHighlight" }) },
  { id: "kar-progressive", name: "Progressive Highlight", category: "Karaoke", ...T({ font: FONTS.body, fontWeight: 600, fontSize: 28, textColor: "#66625A", highlightColor: "#F5F1E8", animation: "wordHighlight" }) },
  // Creative
  { id: "cre-glitch", name: "Glitch", category: "Creative", ...T({ font: FONTS.mono, fontWeight: 600, fontSize: 26, textColor: "#8FE3CF", highlightColor: "#E2574C", animation: "pop" }) },
  { id: "cre-typewriter", name: "Typewriter", category: "Creative", ...T({ font: FONTS.mono, fontWeight: 500, fontSize: 24, textColor: "#F5F1E8", animation: "charReveal" }) },
  { id: "cre-bounce", name: "Bounce", category: "Creative", ...T({ font: FONTS.grotesk, fontWeight: 700, fontSize: 30, textColor: "#FFFFFF", highlightColor: "#C9A227", animation: "bounce" }) },
  { id: "cre-pop", name: "Dynamic Pop", category: "Creative", ...T({ font: FONTS.grotesk, fontWeight: 800, fontSize: 32, textColor: "#0B0B0C", box: true, boxOpacity: 1, highlightColor: "#E2574C", rounded: true, animation: "pop" }) },
];

const CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

/* ------------------------------------------------------------------ */
/*  DEMO CAPTION DATA                                                  */
/* ------------------------------------------------------------------ */
const DEMO_LINES = [
  "Hey everyone, welcome back",
  "Today we're building something special",
  "This is Japtions in action",
  "Captions that actually hit different",
  "Pick a style, make it yours",
  "Preview updates instantly as you type",
  "No watermark, no paywall, ever",
  "Export whenever you're ready",
  "Your video, your captions, your rules",
  "Let's get into it",
];

function buildDemoCaptions(duration = 30) {
  const step = duration / DEMO_LINES.length;
  return DEMO_LINES.map((text, i) => ({
    id: `cap-${i}-${Date.now()}`,
    start: +(i * step).toFixed(2),
    end: +((i + 1) * step - 0.15).toFixed(2),
    text,
  }));
}

const fmt = (s) => {
  if (s == null || isNaN(s)) return "00:00";
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

/* ------------------------------------------------------------------ */
/*  CAPTION OVERLAY (shared by preview + export canvas logic)          */
/* ------------------------------------------------------------------ */
function CaptionOverlay({ caption, style, currentTime, small }) {
  if (!caption) return null;
  const posClass = style.position === "top" ? "top-[6%] items-start" : style.position === "center" ? "top-1/2 -translate-y-1/2 items-center" : "bottom-[7%] items-end";
  const animClass = { fade: "jp-anim-fade", pop: "jp-anim-pop", slide: "jp-anim-slide", bounce: "jp-anim-bounce", wordHighlight: "jp-anim-fade", charReveal: "jp-anim-fade" }[style.animation] || "jp-anim-fade";

  const scale = small ? 0.5 : 1;
  const textShadow = style.shadow ? "0 2px 10px rgba(0,0,0,0.65)" : "none";
  const webkitStroke = style.stroke ? `${1.5 * scale}px ${style.strokeColor}` : undefined;

  let content;
  if (style.animation === "wordHighlight") {
    const words = caption.text.split(" ");
    const dur = caption.end - caption.start || 1;
    const progress = Math.min(Math.max((currentTime - caption.start) / dur, 0), 1);
    const activeIdx = Math.floor(progress * words.length);
    content = words.map((w, i) => (
      <span key={i} style={{ color: i <= activeIdx ? style.highlightColor : style.textColor, transition: "color 0.15s", marginRight: "0.35em" }}>
        {w}
      </span>
    ));
  } else if (style.animation === "charReveal") {
    const dur = caption.end - caption.start || 1;
    const progress = Math.min(Math.max((currentTime - caption.start) / dur, 0), 1);
    const chars = Math.ceil(caption.text.length * progress);
    content = caption.text.slice(0, chars) + (progress < 1 ? "▍" : "");
  } else {
    content = caption.text;
  }

  return (
    <div className={`absolute inset-x-0 flex justify-center px-[6%] pointer-events-none ${posClass}`}>
      <div
        key={caption.id + Math.floor(currentTime * 2)}
        className={`text-center max-w-[90%] ${animClass}`}
        style={{
          fontFamily: style.font,
          fontWeight: style.fontWeight,
          fontSize: `${style.fontSize * scale}px`,
          letterSpacing: `${style.letterSpacing}px`,
          lineHeight: style.lineHeight,
          color: style.textColor,
          textShadow,
          WebkitTextStroke: webkitStroke,
          background: style.box ? `${style.boxColor}${Math.round(style.boxOpacity * 255).toString(16).padStart(2, "0")}` : "transparent",
          padding: style.box ? `${6 * scale}px ${14 * scale}px` : 0,
          borderRadius: style.rounded ? 10 * scale : style.box ? 3 * scale : 0,
          backdropFilter: style.blur ? "blur(6px)" : "none",
        }}
      >
        {content}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LANDING PAGE                                                       */
/* ------------------------------------------------------------------ */
function Logo({ size = 22 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="flex items-center justify-center rounded-[6px]"
        style={{ width: size + 10, height: size + 10, background: "linear-gradient(135deg,#C9A227,#8a6f1a)" }}
      >
        <span className="font-serif font-bold" style={{ color: "#0B0B0C", fontFamily: FONTS.serif, fontSize: size * 0.75 }}>J</span>
      </div>
      <span className="font-display text-[19px] tracking-tight" style={{ color: "#F5F1E8" }}>Japtions</span>
    </div>
  );
}

function LandingHeroPreview() {
  const words = ["Make", "every", "word", "hit", "different."];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActive((a) => (a + 1) % (words.length + 2)), 550);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#232320", background: "linear-gradient(160deg,#141412,#0B0B0C)" }}>
      <div className="aspect-[9/16] sm:aspect-[16/10] relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #C9A227 0, transparent 45%)" }} />
        <div className="flex flex-wrap justify-center gap-x-2 px-10 text-center">
          {words.map((w, i) => (
            <span
              key={i}
              className="font-grotesk font-bold text-2xl sm:text-3xl transition-colors duration-300"
              style={{ fontFamily: FONTS.grotesk, color: i <= active ? "#C9A227" : "#524E45" }}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-[#232320] overflow-hidden">
          <div className="h-full bg-[#C9A227] transition-all duration-500" style={{ width: `${(active / (words.length + 1)) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function Landing({ onStart, onOpenTemplates }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const featured = [TEMPLATES[8], TEMPLATES[22], TEMPLATES[4], TEMPLATES[19]];

  return (
    <div className="min-h-screen font-body" style={{ background: "#0B0B0C", color: "#EDEAE2" }}>
      {/* NAV */}
      <nav className={`sticky top-0 z-40 transition-all ${scrolled ? "backdrop-blur-lg border-b" : ""}`} style={{ background: scrolled ? "rgba(11,11,12,0.75)" : "transparent", borderColor: "#1c1c1a" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[#A9A498]">
            <a href="#home" className="hover:text-[#F5F1E8] transition-colors">Home</a>
            <button onClick={onOpenTemplates} className="hover:text-[#F5F1E8] transition-colors">Templates</button>
            <button onClick={onStart} className="hover:text-[#F5F1E8] transition-colors">Editor</button>
            <a href="#about" className="hover:text-[#F5F1E8] transition-colors">About</a>
          </div>
          <button onClick={onStart} className="text-[13px] font-semibold px-4 py-2 rounded-full transition-transform hover:scale-[1.03]" style={{ background: "#C9A227", color: "#0B0B0C" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#2a2a26", color: "#C9A227" }}>
            <Sparkles size={12} /> 100% free — no watermark, ever
          </div>
          <h1 className="font-display leading-[1.05] mb-5" style={{ fontFamily: FONTS.serif, fontSize: "clamp(38px,6vw,64px)", color: "#F5F1E8" }}>
            Make every word<br /><span style={{ color: "#C9A227" }}>hit different.</span>
          </h1>
          <p className="text-[16px] leading-relaxed mb-8 max-w-md" style={{ color: "#A9A498" }}>
            Create stunning captions for your videos with professional templates, animations, and typography — completely free.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={onStart} className="group flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[14px] transition-transform hover:scale-[1.03]" style={{ background: "#C9A227", color: "#0B0B0C" }}>
              Get Started <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={onOpenTemplates} className="px-6 py-3 rounded-full font-semibold text-[14px] border transition-colors hover:border-[#C9A227]" style={{ borderColor: "#2a2a26", color: "#EDEAE2" }}>
              Explore Templates
            </button>
          </div>
        </div>
        <LandingHeroPreview />
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "#171715" }}>
        <p className="text-[12px] tracking-[0.2em] uppercase mb-8" style={{ color: "#6f6a5f" }}>How it works</p>
        <div className="grid sm:grid-cols-4 gap-6">
          {[
            { icon: Upload, t: "Upload", d: "Drop in any MP4, MOV, or WebM file." },
            { icon: Palette, t: "Choose a Style", d: "Pick from 28 original caption templates." },
            { icon: Settings2, t: "Customize", d: "Tune type, color, position, and motion." },
            { icon: Download, t: "Export", d: "Download your finished video, free." },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ borderColor: "#1c1c1a", background: "#111110" }}>
              <s.icon size={18} style={{ color: "#C9A227" }} />
              <h3 className="font-grotesk font-semibold text-[15px] mt-4 mb-1" style={{ fontFamily: FONTS.grotesk, color: "#F5F1E8" }}>{s.t}</h3>
              <p className="text-[13px]" style={{ color: "#8a8578" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TEMPLATES */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "#171715" }}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase mb-2" style={{ color: "#6f6a5f" }}>Featured templates</p>
            <h2 className="font-display text-[26px]" style={{ fontFamily: FONTS.serif, color: "#F5F1E8" }}>A style for every story</h2>
          </div>
          <button onClick={onOpenTemplates} className="text-[13px] flex items-center gap-1 hover:text-[#C9A227] transition-colors" style={{ color: "#A9A498" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((tpl) => <TemplatePreviewCard key={tpl.id} tpl={tpl} onClick={onStart} />)}
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "#171715" }}>
        <p className="text-[12px] tracking-[0.2em] uppercase mb-8" style={{ color: "#6f6a5f" }}>Why Japtions</p>
        <div className="grid sm:grid-cols-5 gap-6 text-center">
          {["Free", "No Watermark", "28 Templates", "Fast", "Privacy Friendly"].map((w, i) => (
            <div key={i} className="py-6 rounded-xl border" style={{ borderColor: "#1c1c1a" }}>
              <span className="font-grotesk font-semibold text-[14px]" style={{ fontFamily: FONTS.grotesk, color: "#EDEAE2" }}>{w}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRIVACY */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t" style={{ borderColor: "#171715" }}>
        <div className="flex items-start gap-4 p-6 rounded-xl border" style={{ borderColor: "#1c1c1a", background: "#111110" }}>
          <ShieldCheck size={22} style={{ color: "#C9A227" }} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-grotesk font-semibold text-[15px] mb-1" style={{ fontFamily: FONTS.grotesk, color: "#F5F1E8" }}>Your videos are yours.</h3>
            <p className="text-[13px] leading-relaxed" style={{ color: "#8a8578" }}>
              We don't sell or permanently store your uploaded content. Editing happens in your browser whenever possible, and nothing is sent to third-party services.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "#171715" }}>
        <p className="text-[12px] tracking-[0.2em] uppercase mb-4" style={{ color: "#6f6a5f" }}>About</p>
        <p className="font-display text-[22px] leading-relaxed max-w-2xl" style={{ fontFamily: FONTS.serif, color: "#EDEAE2" }}>
          Japtions is a free creative tool designed to help creators turn ordinary videos into engaging captioned content — no subscriptions, no watermarks, no compromises.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t text-center" style={{ borderColor: "#171715" }}>
        <h2 className="font-display mb-6" style={{ fontFamily: FONTS.serif, fontSize: "clamp(28px,4vw,42px)", color: "#F5F1E8" }}>
          Your videos deserve better captions.
        </h2>
        <button onClick={onStart} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[14px] transition-transform hover:scale-[1.03]" style={{ background: "#C9A227", color: "#0B0B0C" }}>
          Start Creating — It's Free <ArrowRight size={15} />
        </button>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t flex items-center justify-between" style={{ borderColor: "#171715" }}>
        <Logo size={16} />
        <span className="text-[12px]" style={{ color: "#55514a" }}>© 2026 Japtions. Made for creators.</span>
      </footer>
    </div>
  );
}

function TemplatePreviewCard({ tpl, onClick, selected, onSelect }) {
  const handle = () => (onSelect ? onSelect(tpl) : onClick && onClick());
  return (
    <button
      onClick={handle}
      className={`group text-left rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5 ${selected ? "ring-2" : ""}`}
      style={{ borderColor: selected ? "#C9A227" : "#1c1c1a", background: "#111110" }}
    >
      <div className="aspect-video flex items-center justify-center relative" style={{ background: "linear-gradient(160deg,#1a1a17,#0B0B0C)" }}>
        <span
          style={{
            fontFamily: tpl.font, fontWeight: tpl.fontWeight, color: tpl.textColor,
            fontSize: 15, letterSpacing: tpl.letterSpacing,
            textShadow: tpl.shadow ? "0 2px 6px rgba(0,0,0,0.6)" : "none",
            WebkitTextStroke: tpl.stroke ? `1px ${tpl.strokeColor}` : undefined,
            background: tpl.box ? `${tpl.boxColor}66` : "transparent",
            padding: tpl.box ? "3px 8px" : 0,
            borderRadius: tpl.rounded ? 6 : tpl.box ? 2 : 0,
          }}
        >
          Sample <span style={{ color: tpl.highlightColor }}>text</span>
        </span>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[12.5px] font-semibold" style={{ color: "#EDEAE2" }}>{tpl.name}</p>
          <p className="text-[10.5px]" style={{ color: "#6f6a5f" }}>{tpl.category}</p>
        </div>
        {selected && <Check size={14} style={{ color: "#C9A227" }} />}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  EDITOR                                                             */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "captions", label: "Captions", icon: Type },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "text", label: "Text", icon: Type },
  { id: "style", label: "Style", icon: Palette },
  { id: "animation", label: "Animation", icon: Sparkles },
  { id: "position", label: "Position", icon: Move },
  { id: "export", label: "Export", icon: Download },
];

function Editor({ onBack }) {
  const [section, setSection] = useState("upload");
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [duration, setDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState(null);

  const [style, setStyle] = useState(TEMPLATES[0]);
  const [activeTemplateId, setActiveTemplateId] = useState(TEMPLATES[0].id);
  const [catFilter, setCatFilter] = useState("All");

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportUrl, setExportUrl] = useState(null);
  const [quality, setQuality] = useState("1080p");

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);

  const activeCaption = useMemo(
    () => captions.find((c) => currentTime >= c.start && currentTime <= c.end),
    [captions, currentTime]
  );

  useEffect(() => {
    return () => { if (videoUrl) URL.revokeObjectURL(videoUrl); };
  }, [videoUrl]);

  const handleUpload = (file) => {
    if (!file) return;
    const okTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"];
    if (!okTypes.includes(file.type) && !/\.(mp4|mov|webm)$/i.test(file.name)) {
      setError("Please upload an MP4, MOV, or WebM video.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoName(file.name);
    setDemoMode(false);
    setCaptions([]);
    setExportUrl(null);
    setSection("captions");
  };

  const onLoadedMeta = () => {
    if (videoRef.current) setDuration(videoRef.current.duration || 30);
  };

  const generateCaptions = () => {
    try {
      const d = demoMode ? 30 : duration || 30;
      setCaptions(buildDemoCaptions(d));
    } catch {
      setError("We couldn't detect captions. You can add them manually.");
    }
  };

  const togglePlay = () => {
    if (demoMode) { setPlaying((p) => !p); return; }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  // demo-mode fake playback clock
  useEffect(() => {
    if (!demoMode || !playing) return;
    const iv = setInterval(() => {
      setCurrentTime((t) => {
        const next = t + 0.1;
        if (next >= 30) { setPlaying(false); return 0; }
        return next;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [demoMode, playing]);

  const onVideoTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const seekTo = (t) => {
    setCurrentTime(t);
    if (!demoMode && videoRef.current) videoRef.current.currentTime = t;
  };

  const applyTemplate = (tpl) => {
    setActiveTemplateId(tpl.id);
    setStyle({ ...tpl });
    setSection("text");
  };

  const updateStyle = (patch) => setStyle((s) => ({ ...s, ...patch }));

  /* ---- caption editing ---- */
  const updateCaption = (id, patch) => setCaptions((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteCaption = (id) => setCaptions((cs) => cs.filter((c) => c.id !== id));
  const addCaption = () => {
    const last = captions[captions.length - 1];
    const start = last ? last.end + 0.1 : 0;
    setCaptions((cs) => [...cs, { id: `cap-new-${Date.now()}`, start, end: start + 2, text: "New caption" }]);
  };
  const splitCaption = (id) => {
    setCaptions((cs) => {
      const idx = cs.findIndex((c) => c.id === id);
      if (idx === -1) return cs;
      const c = cs[idx];
      const mid = +(c.start + (c.end - c.start) / 2).toFixed(2);
      const words = c.text.split(" ");
      const half = Math.ceil(words.length / 2);
      const first = { ...c, end: mid, text: words.slice(0, half).join(" ") || c.text };
      const second = { id: `cap-split-${Date.now()}`, start: mid, end: c.end, text: words.slice(half).join(" ") || c.text };
      const next = [...cs]; next.splice(idx, 1, first, second);
      return next;
    });
  };
  const mergeWithNext = (id) => {
    setCaptions((cs) => {
      const idx = cs.findIndex((c) => c.id === id);
      if (idx === -1 || idx === cs.length - 1) return cs;
      const c = cs[idx], n = cs[idx + 1];
      const merged = { ...c, end: n.end, text: `${c.text} ${n.text}` };
      const next = [...cs]; next.splice(idx, 2, merged);
      return next;
    });
  };

  /* ---- export ---- */
  const runExport = async () => {
    setExportUrl(null);
    if (demoMode) { setError("Upload a real video before exporting — demo mode is preview-only."); return; }
    const video = videoRef.current;
    if (!video) return;
    if (!video.captureStream && !video.mozCaptureStream) {
      setError("Your browser doesn't support in-browser export. Try Chrome or Edge on desktop.");
      return;
    }
    setExporting(true);
    setExportProgress(0);

    const targetH = quality === "1080p" ? 1080 : 720;
    const scale = targetH / video.videoHeight;
    const w = Math.round(video.videoWidth * scale);
    const h = targetH;

    const canvas = canvasRef.current;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");

    const canvasStream = canvas.captureStream(30);
    let mediaStream = canvasStream;
    try {
      const vStream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
      const audioTracks = vStream.getAudioTracks();
      if (audioTracks.length) mediaStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
    } catch { /* audio optional */ }

    const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || "video/webm";
    const recorder = new MediaRecorder(mediaStream, { mimeType: mime, videoBitsPerSecond: quality === "1080p" ? 6_000_000 : 3_000_000 });
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

    let raf;
    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, w, h);
      const t = video.currentTime;
      const cap = captions.find((c) => t >= c.start && t <= c.end);
      if (cap) drawCaptionOnCanvas(ctx, w, h, cap, style, t);
      setExportProgress(Math.min(99, Math.round((t / (duration || 1)) * 100)));
      raf = requestAnimationFrame(drawFrame);
    };

    const finish = () => {
      cancelAnimationFrame(raf);
      recorder.stop();
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setExportUrl(URL.createObjectURL(blob));
      setExporting(false);
      setExportProgress(100);
      video.onended = null;
      video.pause();
    };

    video.currentTime = 0;
    setError(null);
    try {
      await video.play();
      recorder.start();
      raf = requestAnimationFrame(drawFrame);
      video.onended = finish;
    } catch (e) {
      setExporting(false);
      setError("Something went wrong while exporting. Please try again.");
    }
  };

  const filteredTemplates = catFilter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === catFilter);

  return (
    <div className="h-screen flex flex-col font-body overflow-hidden" style={{ background: "#0B0B0C", color: "#EDEAE2" }}>
      <FontLoader />
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "#1c1c1a" }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[13px] flex items-center gap-1 hover:text-[#C9A227] transition-colors" style={{ color: "#A9A498" }}>
            <Menu size={15} /> Japtions
          </button>
          {videoName && <span className="text-[12px] font-mono hidden sm:inline" style={{ color: "#6f6a5f" }}>{videoName}</span>}
          {demoMode && <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: "#3a3222", color: "#C9A227" }}>Demo mode</span>}
        </div>
        <button onClick={() => setSection("export")} className="text-[13px] font-semibold px-4 py-2 rounded-full flex items-center gap-1.5" style={{ background: "#C9A227", color: "#0B0B0C" }}>
          <Download size={14} /> Export Video
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* sidebar */}
        <div className="w-[64px] sm:w-[188px] border-r shrink-0 flex flex-col py-3 gap-0.5 overflow-y-auto jp-scrollbar" style={{ borderColor: "#1c1c1a" }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className="flex items-center gap-3 px-4 sm:px-5 py-2.5 text-[13px] transition-colors"
              style={{
                color: section === s.id ? "#F5F1E8" : "#7a756a",
                background: section === s.id ? "#171715" : "transparent",
                borderLeft: section === s.id ? "2px solid #C9A227" : "2px solid transparent",
              }}
            >
              <s.icon size={16} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* main preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex items-center justify-center p-6 min-h-0">
            <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-xl overflow-hidden border" style={{ borderColor: "#232320", background: "#000" }}>
              {demoMode ? (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(160deg,#1a1a17,#0B0B0C)" }}>
                  <Film size={40} style={{ color: "#2a2a26" }} />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  onLoadedMetadata={onLoadedMeta}
                  onTimeUpdate={onVideoTimeUpdate}
                  onPause={() => setPlaying(false)}
                  onPlay={() => setPlaying(true)}
                  playsInline
                />
              )}
              <CaptionOverlay caption={activeCaption} style={style} currentTime={currentTime} />
              <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center group">
                {!playing && (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                    <Play size={22} fill="#F5F1E8" color="#F5F1E8" />
                  </div>
                )}
              </button>
              <div className="absolute top-3 right-3 text-[11px] font-mono px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.5)", color: "#EDEAE2" }}>
                {fmt(currentTime)} / {fmt(demoMode ? 30 : duration)}
              </div>
            </div>
          </div>

          {/* timeline */}
          <div className="border-t px-6 py-4 shrink-0" style={{ borderColor: "#1c1c1a" }}>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={togglePlay} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1c1c1a" }}>
                {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
              <div
                ref={timelineRef}
                className="relative flex-1 h-8 rounded-md cursor-pointer"
                style={{ background: "#111110" }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  seekTo(pct * (demoMode ? 30 : duration));
                }}
              >
                {captions.map((c) => (
                  <div
                    key={c.id}
                    className="absolute top-1 bottom-1 rounded-sm px-1 flex items-center overflow-hidden"
                    style={{
                      left: `${(c.start / (demoMode ? 30 : duration || 1)) * 100}%`,
                      width: `${((c.end - c.start) / (demoMode ? 30 : duration || 1)) * 100}%`,
                      background: "#2a2417", border: "1px solid #3a3222",
                    }}
                  >
                    <span className="text-[9px] font-mono truncate" style={{ color: "#C9A227" }}>{c.text}</span>
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 w-[2px]" style={{ background: "#C9A227", left: `${(currentTime / (demoMode ? 30 : duration || 1)) * 100}%` }} />
              </div>
              <span className="text-[11px] font-mono shrink-0" style={{ color: "#6f6a5f" }}>{captions.length} lines</span>
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="w-[320px] border-l shrink-0 overflow-y-auto jp-scrollbar p-5" style={{ borderColor: "#1c1c1a" }}>
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-[12px] flex items-start gap-2" style={{ background: "#2a1717", color: "#E2574C", border: "1px solid #3a2222" }}>
              <X size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {section === "upload" && (
            <div>
              <SectionTitle title="Upload" desc="Drop your video to begin." />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files?.[0]); }}
                className="border-2 border-dashed rounded-xl py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors hover:border-[#C9A227]"
                style={{ borderColor: "#2a2a26" }}
              >
                <Upload size={22} style={{ color: "#C9A227" }} />
                <p className="text-[13px] text-center px-4" style={{ color: "#A9A498" }}>Drop your video here<br /><span style={{ color: "#6f6a5f" }}>or</span></p>
                <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "#1c1c1a", color: "#EDEAE2" }}>Browse Files</span>
                <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
              </div>
              <p className="text-[11px] mt-3" style={{ color: "#6f6a5f" }}>Supports MP4, MOV, and WebM. Nothing is uploaded to a server.</p>

              <div className="mt-6 pt-5 border-t" style={{ borderColor: "#1c1c1a" }}>
                <p className="text-[12px] mb-2" style={{ color: "#8a8578" }}>No video handy?</p>
                <button
                  onClick={() => { setDemoMode(true); setVideoUrl(null); setVideoName(null); setDuration(30); setSection("captions"); }}
                  className="text-[12.5px] font-semibold px-3 py-2 rounded-lg border w-full"
                  style={{ borderColor: "#2a2a26", color: "#EDEAE2" }}
                >
                  Try Demo Mode
                </button>
              </div>
            </div>
          )}

          {section === "captions" && (
            <div>
              <SectionTitle title="Captions" desc="Generate, then edit every line." />
              <button onClick={generateCaptions} className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold px-3 py-2.5 rounded-lg mb-4" style={{ background: "#C9A227", color: "#0B0B0C" }}>
                <Wand2 size={14} /> Generate Captions
              </button>
              {captions.length === 0 ? (
                <p className="text-[12.5px]" style={{ color: "#6f6a5f" }}>No captions yet. Generate sample captions or add lines manually.</p>
              ) : (
                <div className="space-y-2">
                  {captions.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg" style={{ background: "#111110", border: currentTime >= c.start && currentTime <= c.end ? "1px solid #C9A227" : "1px solid #1c1c1a" }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <input type="number" step="0.1" value={c.start} onChange={(e) => updateCaption(c.id, { start: +e.target.value })} className="w-14 text-[10px] font-mono bg-transparent border rounded px-1 py-0.5" style={{ borderColor: "#2a2a26", color: "#8a8578" }} />
                        <span className="text-[10px]" style={{ color: "#4a453d" }}>→</span>
                        <input type="number" step="0.1" value={c.end} onChange={(e) => updateCaption(c.id, { end: +e.target.value })} className="w-14 text-[10px] font-mono bg-transparent border rounded px-1 py-0.5" style={{ borderColor: "#2a2a26", color: "#8a8578" }} />
                        <div className="flex-1" />
                        <button onClick={() => splitCaption(c.id)} title="Split" className="p-1 rounded hover:bg-[#1c1c1a]"><Scissors size={11} style={{ color: "#6f6a5f" }} /></button>
                        <button onClick={() => mergeWithNext(c.id)} title="Merge with next" className="p-1 rounded hover:bg-[#1c1c1a]"><Copy size={11} style={{ color: "#6f6a5f" }} /></button>
                        <button onClick={() => deleteCaption(c.id)} title="Delete" className="p-1 rounded hover:bg-[#1c1c1a]"><Trash2 size={11} style={{ color: "#E2574C" }} /></button>
                      </div>
                      <input
                        value={c.text}
                        onChange={(e) => updateCaption(c.id, { text: e.target.value })}
                        className="w-full text-[12.5px] bg-transparent outline-none"
                        style={{ color: "#EDEAE2" }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addCaption} className="w-full flex items-center justify-center gap-1.5 text-[12.5px] font-semibold px-3 py-2 rounded-lg border mt-3" style={{ borderColor: "#2a2a26", color: "#EDEAE2" }}>
                <Plus size={13} /> Add Caption
              </button>
            </div>
          )}

          {section === "templates" && (
            <div>
              <SectionTitle title="Templates" desc="28 original styles across 8 categories." />
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["All", ...CATEGORIES].map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)} className="text-[11px] px-2.5 py-1 rounded-full border transition-colors" style={{ borderColor: catFilter === c ? "#C9A227" : "#2a2a26", color: catFilter === c ? "#C9A227" : "#8a8578" }}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {filteredTemplates.map((tpl) => (
                  <TemplatePreviewCard key={tpl.id} tpl={tpl} selected={activeTemplateId === tpl.id} onSelect={applyTemplate} />
                ))}
              </div>
            </div>
          )}

          {section === "text" && (
            <div className="space-y-5">
              <SectionTitle title="Text" desc="Typography controls." />
              <FieldSelect label="Font" value={style.font} onChange={(v) => updateStyle({ font: v })} options={Object.entries(FONTS).map(([k, v]) => ({ label: k, value: v }))} />
              <FieldSlider label="Size" value={style.fontSize} min={16} max={48} onChange={(v) => updateStyle({ fontSize: v })} suffix="px" />
              <FieldSlider label="Weight" value={style.fontWeight} min={400} max={800} step={100} onChange={(v) => updateStyle({ fontWeight: v })} />
              <FieldSlider label="Letter spacing" value={style.letterSpacing} min={-1} max={4} step={0.1} onChange={(v) => updateStyle({ letterSpacing: v })} suffix="px" />
              <FieldSlider label="Line height" value={style.lineHeight} min={1} max={2} step={0.05} onChange={(v) => updateStyle({ lineHeight: v })} />
            </div>
          )}

          {section === "style" && (
            <div className="space-y-5">
              <SectionTitle title="Style" desc="Color and surface effects." />
              <FieldColor label="Text color" value={style.textColor} onChange={(v) => updateStyle({ textColor: v })} />
              <FieldColor label="Highlight color" value={style.highlightColor} onChange={(v) => updateStyle({ highlightColor: v })} />
              <FieldColor label="Background box color" value={style.boxColor} onChange={(v) => updateStyle({ boxColor: v })} />
              <FieldColor label="Shadow / stroke color" value={style.strokeColor} onChange={(v) => updateStyle({ strokeColor: v })} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Toggle label="Shadow" checked={style.shadow} onChange={(v) => updateStyle({ shadow: v })} />
                <Toggle label="Stroke" checked={style.stroke} onChange={(v) => updateStyle({ stroke: v })} />
                <Toggle label="Background box" checked={style.box} onChange={(v) => updateStyle({ box: v })} />
                <Toggle label="Rounded" checked={style.rounded} onChange={(v) => updateStyle({ rounded: v })} />
                <Toggle label="Blur background" checked={style.blur} onChange={(v) => updateStyle({ blur: v })} />
              </div>
              {style.box && <FieldSlider label="Box opacity" value={style.boxOpacity} min={0.1} max={1} step={0.05} onChange={(v) => updateStyle({ boxOpacity: v })} />}
            </div>
          )}

          {section === "animation" && (
            <div>
              <SectionTitle title="Animation" desc="How each caption enters." />
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "fade", label: "Fade" },
                  { id: "pop", label: "Pop" },
                  { id: "slide", label: "Slide" },
                  { id: "bounce", label: "Bounce" },
                  { id: "wordHighlight", label: "Word Highlight" },
                  { id: "charReveal", label: "Typewriter" },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => updateStyle({ animation: a.id })}
                    className="text-[12px] font-semibold px-3 py-2.5 rounded-lg border transition-colors"
                    style={{ borderColor: style.animation === a.id ? "#C9A227" : "#2a2a26", color: style.animation === a.id ? "#C9A227" : "#A9A498" }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === "position" && (
            <div>
              <SectionTitle title="Position" desc="Where captions sit on screen." />
              <div className="grid grid-cols-3 gap-2">
                {["top", "center", "bottom"].map((p) => (
                  <button
                    key={p}
                    onClick={() => updateStyle({ position: p })}
                    className="text-[12px] font-semibold px-3 py-3 rounded-lg border capitalize transition-colors"
                    style={{ borderColor: style.position === p ? "#C9A227" : "#2a2a26", color: style.position === p ? "#C9A227" : "#A9A498" }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === "export" && (
            <div>
              <SectionTitle title="Export" desc="Render your captioned video." />
              <div className="space-y-2 mb-4">
                <p className="text-[12px] mb-1.5" style={{ color: "#8a8578" }}>Resolution</p>
                <div className="grid grid-cols-2 gap-2">
                  {["720p", "1080p"].map((q) => (
                    <button key={q} onClick={() => setQuality(q)} className="text-[12.5px] font-semibold px-3 py-2 rounded-lg border" style={{ borderColor: quality === q ? "#C9A227" : "#2a2a26", color: quality === q ? "#C9A227" : "#A9A498" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[11.5px] leading-relaxed mb-4 p-3 rounded-lg" style={{ background: "#111110", color: "#6f6a5f" }}>
                Renders as WebM directly in your browser — no watermark, no account, no payment. WebM plays natively in Chrome, Firefox, and Edge; MP4 conversion needs an external tool since it can't be done fully in-browser without extra downloads.
              </div>

              {!exporting && !exportUrl && (
                <button onClick={runExport} className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold px-3 py-3 rounded-lg" style={{ background: "#C9A227", color: "#0B0B0C" }}>
                  <Download size={14} /> Export Video
                </button>
              )}
              {exporting && (
                <div>
                  <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#1c1c1a" }}>
                    <div className="h-full transition-all" style={{ width: `${exportProgress}%`, background: "#C9A227" }} />
                  </div>
                  <p className="text-[12px]" style={{ color: "#8a8578" }}>Rendering… {exportProgress}%</p>
                </div>
              )}
              {exportUrl && !exporting && (
                <a href={exportUrl} download={`japtions-export.webm`} className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold px-3 py-3 rounded-lg" style={{ background: "#8FE3CF", color: "#0B0B0C" }}>
                  <Check size={14} /> Download Video
                </a>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="mb-4">
      <h2 className="font-grotesk font-semibold text-[15px]" style={{ fontFamily: FONTS.grotesk, color: "#F5F1E8" }}>{title}</h2>
      <p className="text-[12px]" style={{ color: "#6f6a5f" }}>{desc}</p>
    </div>
  );
}
function FieldSlider({ label, value, min, max, step = 1, onChange, suffix = "" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px]" style={{ color: "#A9A498" }}>{label}</span>
        <span className="text-[11px] font-mono" style={{ color: "#6f6a5f" }}>{value}{suffix}</span>
      </div>
      <input type="range" className="jp-range w-full" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}
function FieldColor({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px]" style={{ color: "#A9A498" }}>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-md cursor-pointer" />
    </div>
  );
}
function FieldSelect({ label, value, options, onChange }) {
  return (
    <div>
      <p className="text-[12px] mb-1.5" style={{ color: "#A9A498" }}>{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-[12.5px] px-2.5 py-2 rounded-lg border outline-none" style={{ background: "#111110", borderColor: "#2a2a26", color: "#EDEAE2" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function Toggle({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center justify-between px-2.5 py-2 rounded-lg border text-[12px]" style={{ borderColor: checked ? "#C9A227" : "#2a2a26", color: checked ? "#F5F1E8" : "#8a8578" }}>
      {label}
      <div className="w-7 h-4 rounded-full relative shrink-0 ml-2" style={{ background: checked ? "#C9A227" : "#2a2a26" }}>
        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: checked ? 14 : 2 }} />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  CANVAS CAPTION DRAW (export)                                       */
/* ------------------------------------------------------------------ */
function drawCaptionOnCanvas(ctx, w, h, caption, style, t) {
  const scale = w / 1080;
  const fontSize = style.fontSize * scale * 1.6;
  ctx.font = `${style.fontWeight} ${fontSize}px ${style.font.split(",")[0].replace(/'/g, "")}, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let y = h * 0.5;
  if (style.position === "top") y = h * 0.12;
  if (style.position === "bottom") y = h * 0.88;

  const maxWidth = w * 0.85;
  const words = caption.text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else { line = test; }
  });
  if (line) lines.push(line);

  const lineHeight = fontSize * style.lineHeight;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((ln, i) => {
    const ly = startY + i * lineHeight;
    if (style.box) {
      const tw = ctx.measureText(ln).width;
      ctx.fillStyle = style.boxColor + Math.round(style.boxOpacity * 255).toString(16).padStart(2, "0");
      const pad = 14 * scale;
      ctx.fillRect(w / 2 - tw / 2 - pad, ly - fontSize / 2 - pad * 0.5, tw + pad * 2, fontSize + pad);
    }
    if (style.shadow) { ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 10 * scale; ctx.shadowOffsetY = 3 * scale; }
    else { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; }

    if (style.stroke) {
      ctx.lineWidth = 3 * scale;
      ctx.strokeStyle = style.strokeColor;
      ctx.strokeText(ln, w / 2, ly);
    }
    ctx.fillStyle = style.textColor;
    ctx.fillText(ln, w / 2, ly);
  });
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                               */
/* ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("landing");
  return (
    <div className="w-full h-full">
      <FontLoader />
      {page === "landing" ? (
        <Landing onStart={() => setPage("editor")} onOpenTemplates={() => setPage("editor")} />
      ) : (
        <Editor onBack={() => setPage("landing")} />
      )}
    </div>
  );
}
