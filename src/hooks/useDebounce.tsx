import { useState, useEffect } from "react";

export const useDebounce = (
  callback: () => void,
  delay: number,
  dependencies: any[]
) => {
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      callback();
    }, delay);

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [...dependencies]);

  return debounceTimer;
};
