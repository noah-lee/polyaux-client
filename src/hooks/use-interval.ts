import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => callbackRef.current();

    tick();
    const interval = setInterval(tick, delay);
    return () => clearInterval(interval);
  }, [delay]);
};

export default useInterval;
