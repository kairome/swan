import { useEffect, useState } from 'react';

export const useScrollToList = (listId: string, elementsLength: number) => {
  const [id, setListId] = useState(listId);
  useEffect(() => {
    if (id) {
      const newList = document.getElementById(id);
      if (newList !== null) {
        newList.scrollIntoView({ behavior: 'smooth' });
        setListId('');
      }
    }
  }, [elementsLength]);
  return setListId;
};
