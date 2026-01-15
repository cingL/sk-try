import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { cacheGiveaways, getCachedGiveaways } from '@/utils/indexedDB';
import type { GiveawayWithProvider } from '@/types';

const EVENT_ID = import.meta.env.VITE_EVENT_ID;

export function useGiveaways() {
  const [giveaways, setGiveaways] = useState<GiveawayWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGiveaways = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!EVENT_ID) {
        throw new Error('VITE_EVENT_ID is not set in environment variables');
      }

      // Try to load from cache first
      const cached = await getCachedGiveaways();
      if (cached) {
        setGiveaways(cached);
        setLoading(false);
      }

      const { data, error: fetchError } = await supabase
        .from('giveaways')
        .select('*, provider:providers(*)')
        .eq('event_id', EVENT_ID)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      const fetchedData = (data as GiveawayWithProvider[]) || [];
      setGiveaways(fetchedData);
      
      // Cache the data
      await cacheGiveaways(fetchedData);
    } catch (err) {
      // If fetch fails and we have cached data, use it
      const cached = await getCachedGiveaways();
      if (cached) {
        setGiveaways(cached);
        setError(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGiveaways();
  }, [fetchGiveaways]);

  return { giveaways, loading, error, refresh: fetchGiveaways };
}
