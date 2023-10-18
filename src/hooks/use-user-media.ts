import { useEffect, useState } from "react";

const useAudioUserMedia = (audioContext: AudioContext) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [audioSource, setAudioSource] = useState<MediaStreamAudioSourceNode>();

  useEffect(() => {
    const initializeUserMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioSource = new MediaStreamAudioSourceNode(audioContext, {
          mediaStream: mediaStream,
        });

        setMediaStream(mediaStream);
        setAudioSource(audioSource);
      } catch (error) {
        console.error("Cannot access user media:", error);
      }
    };

    initializeUserMedia();

    return () => {
      if (!mediaStream) {
        return;
      }
      mediaStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { mediaStream, audioSource };
};

export default useAudioUserMedia;
