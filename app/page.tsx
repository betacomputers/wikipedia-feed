"use client";

import { useState, useEffect } from "react";
import ArticleFeed from "@/components/articleFeed";
import LikesDrawer from "@/components/likesDrawer";
import { useLikes } from "@/hooks/useLikes";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { liked } = useLikes();
  // const likeCount = Object.keys(liked).length;

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      {/* Floating collection button */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open collection"
        className="fixed top-5 right-5 z-30 flex items-center gap-2 bg-[#111] border border-[#2a2a2a] hover:border-[#444] text-white rounded-full px-4 py-2.5 transition-all duration-200 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 text-red-400">
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      </button>

      {/* Drawer */}
      <LikesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <header className="mb-14 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555] mb-4">
          Endless Knowledge
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-none">
          Wiki<span className="text-[#555]">Scroll</span>
        </h1>
        <p className="text-[#555] font-mono text-sm">
          Random articles from Wikipedia: scroll forever, learn something new.
        </p>
      </header>
      {/* Feed */}
      <ArticleFeed />
    </main>
  );
}
