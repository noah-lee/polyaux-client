import { DependencyList, useEffect } from "react";

const useDebounce = (
  callback: () => void,
  wait: number,
  dependency?: DependencyList
) => {
  useEffect(() => {
    const debounce = setTimeout(() => {
      callback();
    }, wait);

    return () => clearTimeout(debounce);
  }, dependency);
};

export default useDebounce;
