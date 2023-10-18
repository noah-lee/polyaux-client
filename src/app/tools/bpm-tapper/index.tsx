import { useState } from "react";
import ResetButton from "@/app/tools/bpm-tapper/reset-button";
import TapButton from "@/app/tools/bpm-tapper/tap-button";
import { Card } from "@/components/ui/card";
import { useAudioContext } from "@/contexts/audio";
import useKeyDown from "@/hooks/use-key-down";
import { weightedMovingAverage } from "@/utils/math";

const BpmTapper = () => {
  const audioContext = useAudioContext();

  const [timestamps, setTimestamps] = useState<number[]>([]);

  const offsets = timestamps
    .slice(1)
    .map((timestamp, index) => timestamp - timestamps[index]);

  const handleTap = () => {
    audioContext.resume();
    setTimestamps([...timestamps, audioContext.currentTime]);
  };

  const handleReset = () => {
    audioContext.suspend();
    setTimestamps([]);
  };

  const bpm = offsets.length ? 60 / weightedMovingAverage(offsets) : 0;

  return (
    <div className="container flex flex-col ">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">BPM Tapper</h2>
        <Card className="item flex flex-col justify-center gap-8 p-8">
          <TapButton bpm={bpm} onTap={handleTap} />
          <ResetButton onReset={handleReset} />
        </Card>
      </div>
    </div>
  );
};

export default BpmTapper;
