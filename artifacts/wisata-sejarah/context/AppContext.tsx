import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoricalSite, HISTORICAL_SITES } from "@/constants/sites";

interface AppContextType {
  sites: HistoricalSite[];
  favorites: string[];
  recentlyViewed: string[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentlyViewed: (id: string) => void;
  isFavorite: (id: string) => boolean;
  filteredSites: HistoricalSite[];
  featuredSites: HistoricalSite[];
  getSiteById: (id: string) => HistoricalSite | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const favs = await AsyncStorage.getItem("favorites");
      const recent = await AsyncStorage.getItem("recentlyViewed");
      if (favs) setFavorites(JSON.parse(favs));
      if (recent) setRecentlyViewed(JSON.parse(recent));
    })();
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      AsyncStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const addRecentlyViewed = useCallback(async (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r !== id);
      const next = [id, ...filtered].slice(0, 10);
      AsyncStorage.setItem("recentlyViewed", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const filteredSites = HISTORICAL_SITES.filter((site) => {
    const matchesCategory = selectedCategory === "all" || site.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      site.name.toLowerCase().includes(query) ||
      site.nameLocal.toLowerCase().includes(query) ||
      site.location.city.toLowerCase().includes(query) ||
      site.location.province.toLowerCase().includes(query) ||
      site.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const featuredSites = HISTORICAL_SITES.filter((s) => s.rating >= 4.7);

  const getSiteById = (id: string) => HISTORICAL_SITES.find((s) => s.id === id);

  return (
    <AppContext.Provider
      value={{
        sites: HISTORICAL_SITES,
        favorites,
        recentlyViewed,
        selectedCategory,
        searchQuery,
        setSelectedCategory,
        setSearchQuery,
        toggleFavorite,
        addRecentlyViewed,
        isFavorite,
        filteredSites,
        featuredSites,
        getSiteById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
