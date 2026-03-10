"use client";

import { useState, useEffect, useRef } from "react";
import ArticleFeed from "@/components/articleFeed";
import SearchFeed from "@/components/searchFeed";
import LikesDrawer from "@/components/likesDrawer";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setActiveQuery(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
    setSearchOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      {/* Top right controls */}
      <div className="fixed top-5 right-5 z-30 flex items-center gap-2">
        {/* Search */}
        <form onSubmit={handleSearch}>
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-full px-3 py-2">
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
                className="bg-transparent text-white text-xs font-mono w-40 outline-none placeholder:text-[#444]"
              />
              <button
                type="button"
                onClick={clearSearch}
                className="text-[#555] hover:text-white transition-colors shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search"
              className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] hover:border-[#444] text-white rounded-full px-4 py-2.5 transition-all duration-200 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 text-[#aaa]">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          )}
        </form>

        {/* Collection button */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open collection"
          className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] hover:border-[#444] text-white rounded-full px-4 py-2.5 transition-all duration-200 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-red-400">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </button>
      </div>

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

      <div className={activeQuery ? "hidden" : ""}>
        <ArticleFeed />
      </div>
      {activeQuery && <SearchFeed query={activeQuery} />}
    </main>
  );
}
