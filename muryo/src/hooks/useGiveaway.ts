import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { GiveawayWithProvider } from '@/types';

export function useGiveaway(id: string) {
  const [giveaway, setGiveaway] = useState<GiveawayWithProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGiveaway() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('giveaways')
          .select('*, provider:providers(*)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setGiveaway(data as GiveawayWithProvider);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchGiveaway();
    }
  }, [id]);

  return { giveaway, loading, error };
}
