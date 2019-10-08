const useOutsideClick = (container: HTMLDivElement | null, action: () => void): () => void => {
  const handleOutsideClick = (e: MouseEvent) => {
    if (container !== null && container.contains((e.target as Node))) {
      return;
    }
    action();
  };

  window.addEventListener('click', handleOutsideClick, false);
  return () => {
    window.removeEventListener('click', handleOutsideClick, false);
  };
};

export default useOutsideClick;
