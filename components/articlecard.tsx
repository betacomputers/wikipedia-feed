"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
  const storageKey = `like-${article.id}`;
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });
  const [likeCount, setLikeCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(`${storageKey}-count`) ?? "0", 10);
  });

  const handleLike = () => {
    const next = !liked;
    const nextCount = next ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(next);
    setLikeCount(nextCount);
    localStorage.setItem(storageKey, String(next));
    localStorage.setItem(`${storageKey}-count`, String(nextCount));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.07, ease: "easeOut" }}
      className="group relative bg-[#0f0f0f] border border-[#222] rounded-2xl overflow-hidden hover:border-[#444] transition-colors duration-300">
      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold text-white mb-3 leading-snug font-serif">
        {article.title}
      </h2>

      {/* Extract / blurb */}
      <p className="text-[#aaa] text-sm leading-relaxed line-clamp-4 mb-6">{article.extract}</p>
    </motion.article>
  );
}
