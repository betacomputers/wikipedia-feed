"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLikes } from "@/hooks/useLikes";
import ArticleOverlay from "./articleOverlay";

export interface Article {
  id: number;
  title: string;
  extract: string;
  thumbnail: string | null;
  url: string;
  description: string | null;
}

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const { toggle, isLiked, getCount } = useLikes();
  const count = getCount(article.id);
  const liked = isLiked(article.id);
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: (index % 10) * 0.07, ease: "easeOut" }}
        onClick={() => setOverlayOpen(true)}
        className="group relative bg-[#0f0f0f] border border-[#222] rounded-2xl overflow-hidden hover:border-[#444] transition-colors duration-300 cursor-pointer">
        {article.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6">
          {article.description && (
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#888] mb-3 border border-[#333] rounded-full px-3 py-1">
              {article.description}
            </span>
          )}

          <h2 className="text-xl font-semibold text-white mb-3 leading-snug font-serif">
            {article.title}
          </h2>

          <p className="text-[#aaa] text-sm leading-relaxed line-clamp-4 mb-6">{article.extract}</p>

          <div className="flex items-center justify-between">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-[#666] hover:text-white transition-colors duration-200 underline underline-offset-4">
              Read on Wikipedia →
            </a>

            <button
              onClick={() => toggle(article)}
              aria-label={liked ? "Unlike" : "Like"}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 border ${
                liked
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : "bg-transparent border-[#333] text-[#666] hover:border-[#555] hover:text-white"
              }`}>
              <motion.span
                animate={liked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center">
                {liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
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
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </motion.span>
              {count > 0 && <span>{count}</span>}
            </button>
          </div>
        </div>
      </motion.article>

      {overlayOpen && <ArticleOverlay article={article} onClose={() => setOverlayOpen(false)} />}
    </>
  );
}
