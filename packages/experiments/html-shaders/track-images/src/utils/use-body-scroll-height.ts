import { useEffect, useRef, useState } from 'react';

export const useBodyScrollHeight = () => {
  const [scrollHeight, setScrollHeight] = useState(document ? document.body.scrollHeight : 0);
  const observerRef = useRef(null);

  useEffect(() => {
    const callback = () => {
      setScrollHeight(document.body.scrollHeight);
    };

    observerRef.current = new MutationObserver(callback);
    observerRef.current.observe(document.body, { attributes: true });

    return () => {
      observerRef.current.disconnect();
    };
  }, []);

  return scrollHeight;
};
