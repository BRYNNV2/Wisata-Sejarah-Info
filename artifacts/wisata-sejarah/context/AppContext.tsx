import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoricalSite, HISTORICAL_SITES } from "@/constants/sites";

const SITES_STORAGE_KEY = "wisata_sites_data";
const FAVORITES_KEY = "favorites";
const RECENT_KEY = "recentlyViewed";

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
  // CRUD
  addSite: (site: Omit<HistoricalSite, "id">) => Promise<HistoricalSite>;
  updateSite: (id: string, updates: Partial<HistoricalSite>) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  resetSites: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

async function loadSites(): Promise<HistoricalSite[]> {
  try {
    const stored = await AsyncStorage.getItem(SITES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return HISTORICAL_SITES;
}

async function saveSites(sites: HistoricalSite[]) {
  try {
    await AsyncStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  } catch {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<HistoricalSite[]>(HISTORICAL_SITES);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const [loadedSites, favs, recent] = await Promise.all([
        loadSites(),
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(RECENT_KEY),
      ]);
      setSites(loadedSites);
      if (favs) setFavorites(JSON.parse(favs));
      if (recent) setRecentlyViewed(JSON.parse(recent));
    })();
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addRecentlyViewed = useCallback(async (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r !== id);
      const next = [id, ...filtered].slice(0, 10);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const addSite = useCallback(async (siteData: Omit<HistoricalSite, "id">): Promise<HistoricalSite> => {
    const newSite: HistoricalSite = {
      ...siteData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    };
    setSites((prev) => {
      const next = [...prev, newSite];
      saveSites(next);
      return next;
    });
    return newSite;
  }, []);

  const updateSite = useCallback(async (id: string, updates: Partial<HistoricalSite>) => {
    setSites((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveSites(next);
      return next;
    });
  }, []);

  const deleteSite = useCallback(async (id: string) => {
    setSites((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSites(next);
      return next;
    });
  }, []);

  const resetSites = useCallback(async () => {
    setSites(HISTORICAL_SITES);
    await AsyncStorage.removeItem(SITES_STORAGE_KEY);
  }, []);

  const filteredSites = sites.filter((site) => {
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

  const featuredSites = sites.filter((s) => s.rating >= 4.7);
  const getSiteById = (id: string) => sites.find((s) => s.id === id);

  return (
    <AppContext.Provider
      value={{
        sites,
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
        addSite,
        updateSite,
        deleteSite,
        resetSites,
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
