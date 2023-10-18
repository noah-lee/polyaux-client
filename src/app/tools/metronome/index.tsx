import { useState, useRef, useEffect } from "react";
import { Volume2Icon } from "lucide-react";
import BeatsControl from "@/app/tools/metronome/beats-control";
import PlayPauseButton from "@/app/tools/metronome/play-pause-button";
import TempoSlider from "@/app/tools/metronome/tempo-slider";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useAudioContext } from "@/contexts/audio";
import useKeyDown from "@/hooks/use-key-down";
import useMutable from "@/hooks/use-mutable";
import usePrevious from "@/hooks/use-previous";
import { clamp } from "@/utils/math";
import { VolumeSlider } from "@/app/tools/metronome/volume-slider";

const DEFAULT_BEATS = 4;
const SCHEDULE_AHEAD_TIME = 0.1; // 100ms
const LOOK_AHEAD_TIME = 25; // 25ms

const Metronome = () => {
  const audioContext = useAudioContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const currentBeat = useRef(0);
  const previousBeat = usePrevious(currentBeat.current);
  const nextBeatTime = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout>();
  const tempo = useRef(120);
  const beats = useRef(DEFAULT_BEATS);
  const volume = useRef(0.5);
  const setForceRender = useState(false)[1];

  const oscillatorNode = useMutable(new OscillatorNode(audioContext));

  const gainNode = useMutable(new GainNode(audioContext));

  useEffect(() => {
    oscillatorNode.start();
    return () => oscillatorNode.stop();
  }, []);

  const scheduleNextBeat = () => {
    const frequency = currentBeat.current === 0 ? 1000 : 800;
    const time = nextBeatTime.current;

    oscillatorNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillatorNode.frequency.setValueAtTime(frequency, time);

    if (!volume.current) {
      return;
    }

    gainNode.gain.exponentialRampToValueAtTime(volume.current, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
    gainNode.gain.setValueAtTime(0, time + 0.03);
  };

  const incrementBeat = () => {
    const secondsPerBeat = 60 / tempo.current;
    nextBeatTime.current += secondsPerBeat;

    setForceRender((prev) => !prev);
    currentBeat.current = (currentBeat.current + 1) % beats.current;
  };

  const schedule = () => {
    while (
      nextBeatTime.current <
      audioContext.currentTime + SCHEDULE_AHEAD_TIME
    ) {
      scheduleNextBeat();
      incrementBeat();
    }
    timeoutId.current = setTimeout(schedule, LOOK_AHEAD_TIME);
  };

  const handlePlayToggle = () => {
    if (!isPlaying) {
      audioContext.resume();
      nextBeatTime.current = audioContext.currentTime;
      schedule();
      setIsPlaying(true);
    } else {
      audioContext.suspend();
      currentBeat.current = 0;
      clearTimeout(timeoutId.current);
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      setIsPlaying(false);
    }
  };

  useKeyDown(
    (event) => !event.repeat && event.key === " " && handlePlayToggle(),
  );

  const handleTempoChange = (value: number) => {
    tempo.current = value;
    setForceRender((prev) => !prev);
  };

  const handleIncrementBeats = () => {
    beats.current = beats.current + 1;
    setForceRender((prev) => !prev);
  };

  const handleDecrementBeats = () => {
    beats.current = beats.current - 1;
    setForceRender((prev) => !prev);
  };

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = clamp(newVolume, 0, 1);
    volume.current = clampedVolume;
    setForceRender((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Metronome</h2>
        <Card className="item flex flex-col justify-center gap-8 p-8">
          <TempoSlider
            tempo={tempo.current}
            onTempoChange={handleTempoChange}
          />
          <PlayPauseButton isPlaying={isPlaying} onToggle={handlePlayToggle} />
          <VolumeSlider
            volume={volume.current}
            onVolumeChange={handleVolumeChange}
          />
          <BeatsControl
            beats={beats.current}
            isPlaying={isPlaying}
            previousBeat={previousBeat}
            onIncrement={handleIncrementBeats}
            onDecrement={handleDecrementBeats}
          />
        </Card>
      </div>
    </div>
  );
};

export default Metronome;
