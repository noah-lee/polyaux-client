import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import useMutable from "@/hooks/use-mutable";

import useInterval from "@/hooks/use-interval";
import useKeyDown from "@/hooks/use-key-down";
import AudioPlayerClass from "@/audio/audio-player";

type Props = {
  audioContext: AudioContext;
  audioBuffer?: AudioBuffer;
  volume?: number;
  disabled?: boolean;
};

export default function AudioPlayer({
  audioContext,
  audioBuffer,
  volume,
  disabled,
}: Props) {
  const audioPlayer = useMutable(new AudioPlayerClass(audioContext));

  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioBuffer) {
      return;
    }

    audioPlayer.load(audioBuffer);
  }, [audioPlayer, audioBuffer]);

  useEffect(() => {
    if (!volume) {
      return;
    }

    audioPlayer.volume = volume;
  }, [audioPlayer, volume]);

  useEffect(() => {
    return () => audioPlayer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayToggle = () => {
    if (!audioPlayer.ready) {
      return;
    }

    if (audioPlayer.isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }

    setIsPlaying(audioPlayer.isPlaying);
  };

  const handleSeekChange = (values: number[]) => {
    const [value] = values;
    audioPlayer.seek(value);
    setTime(value);
  };

  useInterval(() => setTime(audioPlayer.time), 20);

  audioPlayer.onended = () => {
    setIsPlaying(audioPlayer.isPlaying);
  };

  return (
    <div className="flex w-full items-center gap-4">
      <Button
        onClick={handlePlayToggle}
        disabled={!audioBuffer || disabled}
        className="mr-2"
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Slider
        value={[time]}
        max={audioPlayer.duration}
        step={0.1}
        onValueChange={handleSeekChange}
        disabled={!audioBuffer || disabled}
      />
      <p className="w-[48px] shrink-0 text-right">{secondsToTime(time)}</p>
    </div>
  );
}

const secondsToTime = (seconds: number) => {
  const m = Math.trunc(seconds / 60);
  const s = (seconds % 60).toFixed().padStart(2, "0");
  return `${m}:${s}`;
};
