import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
} from "react";

export type ScrollContextProps = {
  ref: MutableRefObject<HTMLElement | null>;
  onScrollTop: () => void;
};

const ScrollContext = createContext<ScrollContextProps>(
  {} as ScrollContextProps,
);

export const ScrollContextProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLElement | null>(null);

  const handleScrollTop = () => {
    ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollContext.Provider value={{ ref, onScrollTop: handleScrollTop }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
