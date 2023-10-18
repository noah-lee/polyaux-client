export const getMostOccurrence = (array: (string | number)[]) => {
  if (!array.length) {
    return undefined;
  }

  const map = new Map() as Map<string | number, any>;

  for (const item of array) {
    const currentCount = map.get(item) || 0;
    map.set(item, currentCount + 1);
  }

  let mostOccurence = 0;
  let mostOccurenceItem: string | number | undefined;

  map.forEach((count, item) => {
    if (count > mostOccurence) {
      mostOccurence = count;
      mostOccurenceItem = item;
    }
  });

  return mostOccurenceItem;
};

export const getAverage = (array: number[]) => {
  if (!array.length) {
    return undefined;
  }

  return array.reduce((prev, curr) => prev + curr, 0) / array.length;
};
