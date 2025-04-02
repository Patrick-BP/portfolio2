
import { useEffect, useState, useRef, RefObject } from 'react';

export function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Element[]>([]);
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, options);

    return () => observer.current?.disconnect();
  }, [options]);

  useEffect(() => {
    const { current: currentObserver } = observer;
    
    currentObserver?.disconnect();

    if (elements.length > 0) {
      elements.forEach(element => currentObserver?.observe(element));
    }
    
    return () => currentObserver?.disconnect();
  }, [elements]);

  return { 
    observer: observer.current, 
    entries, 
    setElements 
  };
}

export function useAnimateOnScroll(ref: RefObject<HTMLElement>, threshold = 0.1) {
  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, threshold]);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      
      if (scrollHeight > 0) {
        setProgress(scrollTop / scrollHeight);
      }
    };
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
    
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  
  return progress;
}
