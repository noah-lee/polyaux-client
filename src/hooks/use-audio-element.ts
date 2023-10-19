import { useEffect, useState } from "react";

const useAudioElement = (src?: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    if (!src) {
      return;
    }

    setAudio(new Audio(src));
  }, []);

  useEffect(() => {
    return () => audio?.load();
  }, [audio]);

  return audio;
};

export default useAudioElement;
