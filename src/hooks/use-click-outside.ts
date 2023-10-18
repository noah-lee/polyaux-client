import { RefObject, useEffect } from "react";

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = ref?.current;

      if (!element || element.contains(event.target as Node)) return;

      callback(event);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
