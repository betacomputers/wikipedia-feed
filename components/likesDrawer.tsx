"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLikes } from "@/hooks/useLikes";
import { Article } from "@/components/articleCard";

interface LikesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function LikesDrawer({ open, onClose }: LikesDrawerProps) {
  const { liked, toggle } = useLikes();
  const articles = Object.values(liked) as Article[];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-400 bg-[#0a0a0a] border-l border-[#222] z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div>
                <h2 className="text-white font-serif text-xl">Your Collection</h2>
                <p className="text-[#555] font-mono text-xs mt-0.5">
                  {articles.length} {articles.length === 1 ? "article" : "articles"} saved
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#555] hover:text-white transition-colors p-2"
                aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="currentColor"
                    className="size-12 text-[#333] mb-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <p className="text-[#444] font-mono text-sm">No liked articles yet.</p>
                  <p className="text-[#333] font-mono text-xs mt-1">Hit the heart on any card.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {articles.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 items-start bg-[#111] border border-[#1e1e1e] rounded-xl p-3 group">
                      {/* Thumbnail */}
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#1a1a1a] shrink-0 flex items-center justify-center text-[#333]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1"
                            stroke="currentColor"
                            className="size-6">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-sm font-serif leading-snug hover:text-[#aaa] transition-colors line-clamp-2 block">
                          {article.title}
                        </a>
                        {article.description && (
                          <p className="text-[#555] font-mono text-xs mt-1 truncate">
                            {article.description}
                          </p>
                        )}
                      </div>

                      {/* Unlike button */}
                      <button
                        onClick={() => toggle(article)}
                        aria-label="Unlike"
                        className="text-red-400/60 hover:text-red-400 transition-colors shrink-0 pt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
