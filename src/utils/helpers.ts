export const moveArray = <T>(newIndex: number, oldIndex: number, items: T[]): T[] => {
  const newItems = [...items];
  const item = newItems.splice(oldIndex, 1)[0];
  newItems.splice(newIndex, 0, item);
  return newItems;
};
