import { create } from "zustand";
import { Article } from "@/components/articleCard";

interface LikesStore {
  liked: Record<number, Article>;
  counts: Record<number, number>;
  toggle: (article: Article) => void;
  isLiked: (id: number) => boolean;
  getCount: (id: number) => number;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export const useLikes = create<LikesStore>((set, get) => ({
  liked: loadFromStorage("wiki-likes", {}),
  counts: loadFromStorage("wiki-counts", {}),

  toggle: (article: Article) => {
    const { liked, counts } = get();
    const nextLiked = { ...liked };
    const nextCounts = { ...counts };
    const id = article.id;

    if (nextLiked[id]) {
      delete nextLiked[id];
      nextCounts[id] = Math.max(0, (nextCounts[id] ?? 1) - 1);
    } else {
      nextLiked[id] = article;
      nextCounts[id] = (nextCounts[id] ?? 0) + 1;
    }

    localStorage.setItem("wiki-likes", JSON.stringify(nextLiked));
    localStorage.setItem("wiki-counts", JSON.stringify(nextCounts));
    set({ liked: nextLiked, counts: nextCounts });
  },

  isLiked: (id: number) => !!get().liked[id],
  getCount: (id: number) => get().counts[id] ?? 0,
}));
