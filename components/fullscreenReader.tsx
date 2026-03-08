"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "./articleCard";
import { useLikes } from "@/hooks/useLikes";

interface FullscreenReaderProps {
  articles: Article[];
  startIndex: number;
  onClose: (currentIndex: number) => void;
  onNearEnd: () => void;
}

async function fetchLongExtract(title: string): Promise<string> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );
    const data = await res.json();
    return data.extract ?? "";
  } catch {
    return "";
  }
}

function FullscreenCard({ article, active }: { article: Article; active: boolean }) {
  const { toggle, isLiked, getCount } = useLikes();
  const liked = isLiked(article.id);
  const count = getCount(article.id);
  const [extract, setExtract] = useState(article.extract);

  useEffect(() => {
    if (!active) return;
    fetchLongExtract(article.title).then((text) => {
      if (text) setExtract(text);
    });
  }, [active, article.title]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {article.thumbnail && (
        <div className="absolute inset-0">
          <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/30" />
        </div>
      )}
      {!article.thumbnail && <div className="absolute inset-0 bg-[#0a0a0a]" />}

      <div className="relative flex-1 flex flex-col justify-end px-6 pb-16 pt-24 max-w-2xl mx-auto w-full">
        {article.description && (
          <span className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3">
            {article.description}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
          {article.title}
        </h2>
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 line-clamp-6">
          {extract}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors underline underline-offset-4">
            Read full article →
          </a>
          <button
            onClick={() => toggle(article)}
            className={`flex items-center gap-1.5 text-sm font-mono transition-colors ${
              liked ? "text-red-400" : "text-white/50 hover:text-white"
            }`}>
            <motion.span
              animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
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
    </div>
  );
}

export default function FullscreenReader({
  articles,
  startIndex,
  onClose,
  onNearEnd,
}: FullscreenReaderProps) {
  const [current, setCurrent] = useState(startIndex);
  const [exiting, setExiting] = useState(false);
  const isScrolling = useRef(false);
  const articlesRef = useRef(articles);
  articlesRef.current = articles;

  // Trigger load when near end
  const onNearEndRef = useRef(onNearEnd);
  onNearEndRef.current = onNearEnd;

  useEffect(() => {
    if (current >= articles.length - 2) {
      onNearEndRef.current();
    }
  }, [current, articles.length]);

  // Close with zoom-out
  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose(currentRef.current), 350);
  };

  // Escape key
  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExiting(true);
        setTimeout(() => onClose(currentRef.current), 350);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Wheel / touch snap with bounce
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;
      if (e.deltaY > 5) {
        isScrolling.current = true;
        setCurrent((c) => Math.min(c + 1, articlesRef.current.length - 1));
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);
      } else if (e.deltaY < -5) {
        isScrolling.current = true;
        setCurrent((c) => Math.max(c - 1, 0));
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > 50) {
        isScrolling.current = true;
        setCurrent((c) => Math.min(c + 1, articlesRef.current.length - 1));
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);
      } else if (delta < -50) {
        isScrolling.current = true;
        setCurrent((c) => Math.max(c - 1, 0));
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={exiting ? { scale: 0.92, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 z-10 text-white/40 hover:text-white transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Cards */}
      <motion.div
        className="flex flex-col w-full"
        style={{ height: `${articles.length * 100}vh` }}
        initial={{ y: `-${startIndex * 100}vh` }}
        animate={{ y: `-${current * 100}vh` }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}>
        {articles.map((article, i) => (
          <div key={article.id} style={{ height: "100vh", flexShrink: 0 }}>
            <FullscreenCard article={article} active={i === current} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
