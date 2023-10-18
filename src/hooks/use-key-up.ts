import { useEffect } from "react";

const useKeyUp = (handler: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener("keyup", handler);

    return () => {
      window.removeEventListener("keyup", handler);
    };
  }, [handler]);
};

export default useKeyUp;
