import { useState, useCallback, useRef } from "react";
import { searchMedicinesAPI } from "@/services/medicineService";

export const useMedicineSearch = () => {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const debounceRef             = useRef(null);

  const search = useCallback((query) => {
    // Debounce  - 300ms wait kara
    clearTimeout(debounceRef.current);

    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchMedicinesAPI(query);
        setResults(res.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
};