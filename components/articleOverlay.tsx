"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Article } from "./articleCard";

interface Section {
  title: string;
  content: string;
}

function sanitize(html: string): string {
  return html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<table[\s\S]*?<\/table>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/\s*style="[^"]*"/gi, "")
    .replace(/\s*class="[^"]*"/gi, "")
    .replace(/\s*id="[^"]*"/gi, "")
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1")
    .trim();
}

export default function ArticleOverlay({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/article?title=${encodeURIComponent(article.title)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.sections?.length) {
          setSections(data.sections);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [article.title]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 280 }}
      className="fixed inset-0 z-50 bg-[#080808] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#555] hover:text-white transition-colors font-mono text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#444] hover:text-white font-mono text-xs transition-colors">
          Wikipedia ↗
        </a>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {article.thumbnail && (
          <div className="relative h-56 w-full overflow-hidden shrink-0">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
          </div>
        )}

        <div className="max-w-2xl mx-auto px-6 pt-6 pb-24">
          {article.description && (
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#555] mb-3">
              {article.description}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
            {article.title}
          </h1>
          <div className="w-12 h-px bg-[#333] mb-8" />

          {loading && (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#111] rounded animate-pulse ${i % 3 === 0 ? "h-4 w-3/4" : "h-3"}`}
                />
              ))}
            </div>
          )}

          {!loading && error && <p className="text-[#666] text-sm font-mono">{article.extract}</p>}

          {!loading && !error && (
            <div className="space-y-8">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <h2 className="text-lg font-serif text-white mb-4 pb-2 border-b border-[#1a1a1a]">
                      {section.title}
                    </h2>
                  )}
                  <div
                    className="wiki-content"
                    dangerouslySetInnerHTML={{ __html: sanitize(section.content) }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
