"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleCard, { Article } from "./articleCard";
import FullscreenReader from "./fullscreenReader";

async function fetchArticles() {
  const res = await fetch("/api/wikipedia");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{ articles: Article[] }>;
}

export default function ArticleFeed() {
  const { data, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => pages.length,
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isFetchingRef = useRef(isFetchingNextPage);
  isFetchingRef.current = isFetchingNextPage;

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  // Regular infinite scroll
  useEffect(() => {
    function onScroll() {
      const scrolledTo = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight - scrolledTo < 200 && !isFetchingRef.current) {
        fetchNextPageRef.current();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Find the card closest to center of viewport to open fullscreen at
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

  // On exit, scroll to the card the user was on
  const handleClose = (currentIndex: number) => {
    setExpandedIndex(null);
    setTimeout(() => {
      const el = cardRefs.current[currentIndex];
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, 50);
  };

  const allArticles = data?.pages.flatMap((p) => p.articles) ?? [];

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeletons />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-red-400 font-mono mt-20">
        Failed to load articles. Check your connection.
      </p>
    );
  }

  return (
    <div>
      {expandedIndex !== null && (
        <FullscreenReader
          articles={allArticles}
          startIndex={expandedIndex}
          onClose={handleClose}
          onNearEnd={() => {
            if (!isFetchingRef.current) fetchNextPageRef.current();
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map((article, i) => (
          <div
            key={`${article.id}-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}>
            <ArticleCard article={article} index={i} />
          </div>
        ))}
        {isFetchingNextPage && <LoadingSkeletons />}
      </div>

      {/* Global fullscreen button */}
      {expandedIndex === null && (
        <button
          onClick={openFullscreen}
          aria-label="Enter fullscreen"
          className="fixed bottom-6 right-6 z-30 bg-[#111] border border-[#2a2a2a] hover:border-[#555] text-white/50 hover:text-white rounded-full p-3 transition-all duration-200 shadow-lg">
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

function LoadingSkeletons() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl h-72 animate-pulse"
        />
      ))}
    </>
  );
}
