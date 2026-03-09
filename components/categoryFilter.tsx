"use client";

import { useRef, useState } from "react";

export const CATEGORY_LIST = [
  "All",
  "Sports",
  "Music",
  "Film",
  "Politics",
  "Science",
  "Technology",
  "History",
  "Military",
  "Nature",
  "Place",
  "Business",
  "Arts",
  "Literature",
  "Religion",
  "Medicine",
  "Education",
  "Food",
  "Transport",
  "Culture",
  "Person",
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mb-10">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-200 border ${
              selected === cat
                ? "bg-white text-black border-white"
                : "bg-transparent text-[#666] border-[#333] hover:border-[#555] hover:text-white"
            }`}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
