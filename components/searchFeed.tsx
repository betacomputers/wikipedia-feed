"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard, { Article } from "./articleCard";
import FullscreenReader from "./fullscreenReader";

async function searchArticles(query: string): Promise<{ articles: Article[] }> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

interface SearchFeedProps {
  query: string;
}

export default function SearchFeed({ query }: SearchFeedProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, status } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchArticles(query),
    enabled: query.length > 0,
  });

  // Reset expanded when query changes
  useEffect(() => {
    setExpandedIndex(null);
    window.scrollTo(0, 0);
  }, [query]);

  const articles = data?.articles ?? [];

  const openFullscreen = () => {
    const center = window.scrollY + window.innerHeight / 2;
    let closest = 0;
    let minDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = window.scrollY + rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setExpandedIndex(closest);
  };

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl h-72 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-center text-red-400 font-mono mt-20">Search failed. Try again.</p>;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-[#444] font-mono text-sm">No results for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div>
      {expandedIndex !== null && (
        <FullscreenReader
          articles={articles}
          startIndex={expandedIndex}
          onClose={() => setExpandedIndex(null)}
          onNearEnd={() => {}}
        />
      )}

      <p className="text-[#555] font-mono text-xs mb-6">
        {articles.length} results for &quot;{query}&quot;
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <div
            key={article.id}
            id={`search-card-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}>
            <ArticleCard article={article} index={i} />
          </div>
        ))}
      </div>

      {expandedIndex === null && (
        <button
          onClick={openFullscreen}
          aria-label="Enter fullscreen"
          className="fixed bottom-20 right-6 z-30 bg-[#111] border border-[#2a2a2a] hover:border-[#555] text-white/50 hover:text-white rounded-full p-3 transition-all duration-200 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
