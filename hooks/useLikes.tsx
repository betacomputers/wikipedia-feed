import { create } from "zustand";
import { Article } from "@/components/articleCard";

interface LikesStore {
  liked: Record<number, Article>;
  toggle: (article: Article) => void;
  isLiked: (id: number) => boolean;
}

function loadFromStorage(): Record<number, Article> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("wiki-likes") ?? "{}");
  } catch {
    return {};
  }
}

function saveToStorage(liked: Record<number, Article>) {
  localStorage.setItem("wiki-likes", JSON.stringify(liked));
}

export const useLikes = create<LikesStore>((set, get) => ({
  liked: loadFromStorage(),

  toggle: (article: Article) => {
    const current = get().liked;
    const next = { ...current };
    if (next[article.id]) {
      delete next[article.id];
    } else {
      next[article.id] = article;
    }
    saveToStorage(next);
    set({ liked: next });
  },

  isLiked: (id: number) => !!get().liked[id],
}));
