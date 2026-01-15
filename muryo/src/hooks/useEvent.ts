import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Event } from '@/types';

const EVENT_ID = import.meta.env.VITE_EVENT_ID;

export function useEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);

        if (!EVENT_ID) {
          throw new Error('VITE_EVENT_ID is not set in environment variables');
        }

        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', EVENT_ID)
          .single();

        if (fetchError) throw fetchError;
        setEvent(data as Event);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, []);

  return { event, loading, error };
}
