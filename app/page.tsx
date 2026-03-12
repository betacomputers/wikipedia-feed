"use client";

import { useState, useEffect } from "react";
import ArticleFeed from "@/components/articleFeed";
import SearchFeed from "@/components/searchFeed";
import LikesDrawer from "@/components/likesDrawer";

type Tab = "home" | "search" | "graph";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const goHome = () => {
    setActiveTab("home");
    setSearchQuery("");
    setActiveQuery("");
  };

  return (
    <main className="min-h-screen px-4 py-12 pb-28 max-w-6xl mx-auto">
      {/* Top right — collection only */}
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
      <div className={activeQuery ? "hidden" : ""}>
        <ArticleFeed />
      </div>
      {activeQuery && <SearchFeed query={activeQuery} />}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="flex items-center justify-around max-w-lg mx-auto px-8 py-4">
          {/* Home */}
          <button
            onClick={goHome}
            aria-label="Home"
            className={`flex items-center justify-center transition-all duration-200 ${
              activeTab === "home" ? "text-white" : "text-white/30 hover:text-white/60"
            }`}>
            {activeTab === "home" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            ) : (
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
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
