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
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<span class="mw-editsection"[\s\S]*?<\/span>/gi, "")
    .replace(/\s*style="[^"]*"/gi, "")
    .replace(/\s*class="[^"]*"/gi, "")
    .replace(/\s*id="[^"]*"/gi, "")
    .replace(/<a\s[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/<span[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "")
    .trim();
}

async function fetchSections(title: string): Promise<Section[]> {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(title)}`,
    { headers: { "Api-User-Agent": "wikipedia-feed/1.0" } },
  );
  if (!res.ok) return [];
  const data = await res.json();

  const sections: Section[] = [];

  if (data.lead?.sections?.[0]?.text) {
    sections.push({ title: "", content: data.lead.sections[0].text });
  }

  const skip = new Set([
    "references",
    "external links",
    "notes",
    "see also",
    "further reading",
    "bibliography",
    "footnotes",
  ]);
  for (const section of data.remaining?.sections ?? []) {
    if (section.toclevel === 1 && skip.has(section.line?.toLowerCase())) continue;
    if (section.text?.trim()) {
      sections.push({ title: section.line ?? "", content: section.text });
    }
  }

  return sections;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetchSections(article.title).then((s) => {
      setSections(s);
      setLoading(false);
    });
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
      className="fixed inset-0 z-50 bg-[#080808] flex flex-col"
      style={{ bottom: "57px" }}>
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {article.thumbnail && (
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          </div>
        )}

        <div
          className={`max-w-2xl mx-auto px-6 pb-16 ${article.thumbnail ? "-mt-16 relative" : "pt-10"}`}>
          {article.description && (
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#555] mb-3">
              {article.description}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
            {article.title}
          </h1>
          <div className="w-12 h-px bg-[#333] mb-8" />

          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#111] rounded animate-pulse ${i === 0 ? "h-4 w-3/4" : "h-3"}`}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <h2 className="text-lg font-serif text-white mb-4 pb-2 border-b border-[#1a1a1a]">
                      {section.title}
                    </h2>
                  )}
                  <div
                    className="wiki-content text-[#999] text-sm leading-relaxed"
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
