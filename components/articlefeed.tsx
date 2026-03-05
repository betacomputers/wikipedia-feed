"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleCard, { Article } from "./articlecard";

async function fetchArticles() {
  const res = await fetch("/api/wikipedia");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{ articles: Article[] }>;
}

export default function ArticleFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => pages.length, // always has more
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allArticles = data?.pages.flatMap((p) => p.articles) ?? [];

  if (status === "pending") {
    return <LoadingGrid />;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map((article, i) => (
          <ArticleCard key={`${article.id}-${i}`} article={article} index={i} />
        ))}
        {isFetchingNextPage && <LoadingGrid />}
      </div>

      {/* Scroll sentinel */}
      <div ref={sentinelRef} className="h-20" />
    </div>
  );
}

function LoadingGrid() {
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
