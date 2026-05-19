import { useState, useEffect, useCallback } from 'react';

type Club = {
  name: string;
  city: string;
  slug: string;
};

export function useClubSearch() {
  const [query, setQuery] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClubs = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs?search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setClubs(Array.isArray(data) ? data : []);
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