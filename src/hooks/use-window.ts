import { useEffect, useState } from 'react';

export const useWindow = () => {
  const [docWindow, setDocWindow] = useState<Window>();
  const isWindow = typeof window !== 'undefined';
  useEffect(() => {
    if (isWindow) {
      setDocWindow(window);
    }
  }, [isWindow]);
  return docWindow;
};
