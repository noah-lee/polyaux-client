import { RefObject, useEffect, useState } from "react";

const useElementSize = <T extends HTMLElement>(ref: RefObject<T> | null) => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const handleResize = () => {
      if (!ref?.current) {
        return;
      }

      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  return { width, height };
};

export default useElementSize;
