import { useEffect } from 'react';

const useOutsideClick = (container: HTMLDivElement | null, toggle: (v: boolean) => void) => {
  useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      if (container !== null && container.contains((e.target as Node))) {
        return;
      }

      toggle(false);
    };

    window.addEventListener('click', handleOutsideClick, false);
    return () => {
      window.removeEventListener('click', handleOutsideClick, false);
    };
  });
};

export default useOutsideClick;
