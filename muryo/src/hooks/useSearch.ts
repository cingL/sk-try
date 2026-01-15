import { useState, useEffect, useMemo } from 'react';
import type { GiveawayWithProvider } from '@/types';
import type { GiveawayCategory } from '@/types';

export interface SearchFilters {
  query: string;
  categories: GiveawayCategory[];
  areas: string[];
}

export function useSearch(
  giveaways: GiveawayWithProvider[],
  debounceMs: number = 300
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<GiveawayCategory[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Get unique areas from giveaways
  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    giveaways.forEach((giveaway) => {
      if (giveaway.provider.booth_area) {
        areas.add(giveaway.provider.booth_area);
      }
    });
    return Array.from(areas).sort();
  }, [giveaways]);

  // Filter giveaways based on search query and filters
  const filteredGiveaways = useMemo(() => {
    let filtered = [...giveaways];

    // Text search: match title, description, or provider name
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim();
      filtered = filtered.filter((giveaway) => {
        const titleMatch = giveaway.title.toLowerCase().includes(query);
        const descMatch = giveaway.description?.toLowerCase().includes(query);
        const providerMatch = giveaway.provider.name.toLowerCase().includes(query);
        return titleMatch || descMatch || providerMatch;
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((giveaway) =>
        giveaway.category && selectedCategories.includes(giveaway.category)
      );
    }

    // Area filter
    if (selectedAreas.length > 0) {
      filtered = filtered.filter((giveaway) =>
        selectedAreas.includes(giveaway.provider.booth_area)
      );
    }

    return filtered;
  }, [giveaways, debouncedQuery, selectedCategories, selectedAreas]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedAreas([]);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || 
    selectedCategories.length > 0 || 
    selectedAreas.length > 0;

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedAreas,
    setSelectedAreas,
    availableAreas,
    filteredGiveaways,
    clearFilters,
    hasActiveFilters,
  };
}
