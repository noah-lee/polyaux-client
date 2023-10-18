import { createContext, ReactNode, useContext } from "react";

const AudioContext = createContext<AudioContext>({} as AudioContext);

export const AudioContextProvider = ({
  children,
  options,
}: {
  children: ReactNode;
  options?: AudioContextOptions;
}) => {
  const audioContext = new window.AudioContext(options);

  return (
    <AudioContext.Provider value={audioContext}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext(AudioContext);
