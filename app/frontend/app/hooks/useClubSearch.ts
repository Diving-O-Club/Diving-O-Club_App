import { useState, useEffect, useCallback } from 'react';
import { searchClubs, type ClubSearchResult } from '@/app/lib/api/clubs';

export function useClubSearch() {
  const [query, setQuery] = useState('');
  const [clubs, setClubs] = useState<ClubSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClubs = useCallback(async (search: string) => {
    setLoading(true);
    try {
      setClubs(await searchClubs(search));
    } catch {
      setClubs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClubs(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchClubs]);

  return { query, setQuery, clubs, loading };
}
