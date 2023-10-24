import { createContext, ReactNode, useContext, useState } from "react";

export type Adsr = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type AdsrContextProps = {
  adsr: Adsr;
  onAdsrChange: (adsr: Adsr) => void;
};

const AdsrContext = createContext<AdsrContextProps>({} as AdsrContextProps);

export const AdsrContextProvider = ({ children }: { children: ReactNode }) => {
  const [adsr, setAdsr] = useState({
    attack: 0.05,
    decay: 2,
    sustain: 0,
    release: 2,
  });

  const handleAdsrChange = (adsr: Adsr) => {
    setAdsr(adsr);
  };

  return (
    <AdsrContext.Provider value={{ adsr, onAdsrChange: handleAdsrChange }}>
      {children}
    </AdsrContext.Provider>
  );
};

export const useAdsrContext = () => useContext(AdsrContext);
