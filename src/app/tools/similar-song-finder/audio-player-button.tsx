import { useState } from "react";
import CircularSlider from "@/components/ui/circular-slider";
import useInterval from "@/hooks/use-interval";
import { PauseIcon, PlayIcon, SpeakerIcon, VolumeXIcon } from "lucide-react";
import { cn } from "@/utils/styles";

type Props = {
  audioElement: HTMLAudioElement | undefined;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

const AudioPlayerButton = ({
  audioElement,
  isPlaying,
  onPlay,
  onPause,
}: Props) => {
  const [audioPercentage, setAudioPercentage] = useState(0);

  useInterval(() => {
    if (!audioElement || !isPlaying) {
      return;
    }

    if (audioElement.ended) {
      setAudioPercentage(0);
      onPause?.();
    } else {
      setAudioPercentage(audioElement.currentTime / audioElement.duration);
    }
  }, 20);

  return (
    <div className="relative h-[48px] w-[48px]">
      <CircularSlider
        readOnly
        size={48}
        thickness={4}
        value={audioPercentage}
        max={1}
        step={0.01}
      />
      <button
        className={cn(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2",
          "h-[48px] w-[48px] items-center justify-center rounded-full",
          !audioElement && "opacity-50",
        )}
        disabled={!audioElement}
        onClick={isPlaying ? onPause : onPlay}
      >
        {audioElement && isPlaying && <PauseIcon width={20} height={20} />}
        {audioElement && !isPlaying && <PlayIcon width={20} height={20} />}
        {!audioElement && <VolumeXIcon width={20} height={20} />}
      </button>
    </div>
  );
};

export default AudioPlayerButton;
