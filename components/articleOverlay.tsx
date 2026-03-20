"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Article } from "./articleCard";
import { useLikes } from "@/hooks/useLikes";

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

function SimilarCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  const { toggle, isLiked } = useLikes();
  const liked = isLiked(article.id);

  return (
    <div
      onClick={() => onOpen(article)}
      className="shrink-0 w-56 bg-[#0f0f0f] border border-[#222] rounded-2xl overflow-hidden cursor-pointer hover:border-[#444] transition-colors duration-200">
      {article.thumbnail ? (
        <div className="relative h-32 overflow-hidden">
          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-32 bg-[#111]" />
      )}
      <div className="p-3">
        {article.description && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#555] mb-1 block truncate">
            {article.description}
          </span>
        )}
        <h3 className="text-sm font-serif text-white leading-snug line-clamp-2 mb-2">
          {article.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(article);
          }}
          className={`text-xs transition-colors ${liked ? "text-red-400" : "text-[#444] hover:text-white"}`}>
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
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
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
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
  const [similar, setSimilar] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article>(article);
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
    setSimilar([]);
    scrollRef.current?.scrollTo(0, 0);

    fetch(`/api/article?title=${encodeURIComponent(currentArticle.title)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.sections?.length) setSections(data.sections);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    // Fetch similar articles via search
    fetch(`/api/search?q=${encodeURIComponent(currentArticle.title)}`)
      .then((r) => r.json())
      .then((data) => {
        const results: Article[] = (data.articles ?? [])
          .filter((a: Article) => a.id !== currentArticle.id)
          .slice(0, 10);
        setSimilar(results);
      })
      .catch(() => {});
  }, [currentArticle.title]);

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
          href={currentArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#444] hover:text-white font-mono text-xs transition-colors">
          Wikipedia ↗
        </a>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {currentArticle.thumbnail && (
          <div className="relative h-56 w-full overflow-hidden shrink-0">
            <img
              src={currentArticle.thumbnail}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-[#080808]/30 to-transparent" />
          </div>
        )}

        <div className="max-w-2xl mx-auto px-6 pt-6 pb-4">
          {currentArticle.description && (
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#555] mb-3">
              {currentArticle.description}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
            {currentArticle.title}
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

          {!loading && error && (
            <p className="text-[#666] text-sm leading-relaxed">{currentArticle.extract}</p>
          )}

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

        {/* Similar articles */}
        {similar.length > 0 && (
          <div className="mt-8 pb-8">
            <p className="text-[#444] font-mono text-xs uppercase tracking-widest px-6 mb-4">
              Similar Articles
            </p>
            <div
              className="flex gap-3 overflow-x-auto px-6 pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {similar.map((a) => (
                <SimilarCard key={a.id} article={a} onOpen={setCurrentArticle} />
              ))}
            </div>
          </div>
        )}

        {similar.length === 0 && !loading && <div className="pb-8" />}
      </div>
    </motion.div>
  );
}
