import { useEffect } from 'react';

export default (setWindowSize: (payload: { width:  number, height: number }) => void) => {
  const handleEvent = (event: Event) => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener('resize', handleEvent);
    return () => window.removeEventListener('resize', handleEvent);
  }, []);
};
