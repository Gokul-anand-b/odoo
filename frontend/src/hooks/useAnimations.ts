'use client';

import { useEffect, useRef, useState } from 'react';

export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true
): { value: number; ref: React.RefObject<HTMLDivElement | null> } {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration, startOnView]);

  function animate() {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return { value, ref };
}

export function useInView(threshold: number = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
