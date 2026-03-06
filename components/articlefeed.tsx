"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleCard, { Article } from "./articleCard";

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

  const isFetchingRef = useRef(isFetchingNextPage);
  isFetchingRef.current = isFetchingNextPage;

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  useEffect(() => {
    function onScroll() {
      const scrolledTo = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const nearBottom = pageHeight - scrolledTo < 300;

      if (nearBottom && !isFetchingRef.current) {
        fetchNextPageRef.current();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map((article, i) => (
          <ArticleCard key={`${article.id}-${i}`} article={article} index={i} />
        ))}
        {isFetchingNextPage && <LoadingSkeletons />}
      </div>
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
