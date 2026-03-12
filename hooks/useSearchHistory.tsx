import { create } from "zustand";

interface SearchHistoryStore {
  history: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
}

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wiki-search-history") ?? "[]");
  } catch {
    return [];
  }
}

function saveToStorage(history: string[]) {
  localStorage.setItem("wiki-search-history", JSON.stringify(history));
}

export const useSearchHistory = create<SearchHistoryStore>((set, get) => ({
  history: loadFromStorage(),

  add: (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [trimmed, ...get().history.filter((h) => h !== trimmed)].slice(0, 10);
    saveToStorage(next);
    set({ history: next });
  },

  remove: (query: string) => {
    const next = get().history.filter((h) => h !== query);
    saveToStorage(next);
    set({ history: next });
  },

  clear: () => {
    localStorage.removeItem("wiki-search-history");
    set({ history: [] });
  },
}));
