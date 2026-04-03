"use client";

import { useState, useEffect, useRef } from "react";
import ArticleFeed from "@/components/articleFeed";
import SearchFeed from "@/components/searchFeed";
import LikesDrawer from "@/components/likesDrawer";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import GraphView from "@/components/graphView";
import WikiPack from "@/components/wikiPack";

type Tab = "home" | "search" | "graph" | "cards";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { history: searchHistory, add, remove, clear } = useSearchHistory();

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

  const goSearch = () => {
    setActiveTab("search");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const runSearch = (q: string) => {
    setSearchQuery(q);
    setActiveQuery(q);
    add(q);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) runSearch(searchQuery.trim());
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
      <div className={activeTab !== "home" ? "hidden" : ""}>
        <ArticleFeed />
      </div>

      {/* Search view */}
      {activeTab === "search" && (
        <div>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-2xl px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 text-[#555] shrink-0">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Wikipedia..."
                className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-[#444]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveQuery("");
                  }}
                  className="text-[#555] hover:text-white transition-colors shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Search history */}
          {!activeQuery && searchHistory.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#444] font-mono text-xs uppercase tracking-widest">Recent</p>
                <button
                  onClick={clear}
                  className="text-[#444] hover:text-white font-mono text-xs transition-colors">
                  Clear all
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {searchHistory.map((q) => (
                  <div key={q} className="flex items-center justify-between px-1 py-1.5">
                    <button
                      onClick={() => runSearch(q)}
                      className="flex items-center gap-3 text-[#888] hover:text-white transition-colors font-mono text-sm text-left">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3.5 text-[#444] shrink-0">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      {q}
                    </button>
                    <button
                      onClick={() => remove(q)}
                      className="text-[#444] hover:text-white transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeQuery && <SearchFeed query={activeQuery} />}
        </div>
      )}

      {/* Graph view */}
      {activeTab === "graph" && <GraphView />}
      {activeTab === "cards" && <WikiPack />}

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

          {/* Search */}
          <button
            onClick={goSearch}
            aria-label="Search"
            className={`flex items-center justify-center transition-all duration-200 ${activeTab === "search" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
            {activeTab === "search" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5">
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            )}
          </button>

          {/* Graph */}
          <button
            onClick={() => setActiveTab("graph")}
            aria-label="Graph"
            className={`flex items-center justify-center transition-all duration-200 ${activeTab === "graph" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
            {activeTab === "graph" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5">
                <path
                  fillRule="evenodd"
                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                  clipRule="evenodd"
                />
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
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            )}
          </button>

          {/* Cards */}
          <button
            onClick={() => setActiveTab("cards")}
            aria-label="Cards"
            className={`flex items-center justify-center transition-all duration-200 ${activeTab === "cards" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
            {activeTab === "cards" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5">
                <path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5ZM12.75 3v4.011a3 3 0 0 1 4.239 4.239H22.5v-6A2.25 2.25 0 0 0 20.25 3h-7.5ZM22.5 12.75h-8.983a4.125 4.125 0 0 1-4.5 0H1.5v6A2.25 2.25 0 0 0 3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25v-6ZM12 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
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
                  d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
