import { useState } from "react";
import ResetButton from "@/app/tools/bpm-tapper/reset-button";
import TapButton from "@/app/tools/bpm-tapper/tap-button";
import { Card } from "@/components/ui/card";
import { useAudioContext } from "@/contexts/audio";
import { percentage, weightedMovingAverage } from "@/utils/math";
import useInterval from "@/hooks/use-interval";

const RESET_TIME = 3000;
const DELAY = 16;

const BpmTapper = () => {
  const audioContext = useAudioContext();

  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [shouldReset, setShouldReset] = useState(true);

  const offsets = timestamps
    .slice(1)
    .map((timestamp, index) => timestamp - timestamps[index]);

  const handleTap = () => {
    audioContext.resume();
    if (shouldReset) {
      setTimestamps([audioContext.currentTime]);
      setShouldReset(false);
    } else {
      setTimestamps([...timestamps, audioContext.currentTime]);
    }
    setTimer(RESET_TIME);
  };

  const handleReset = () => {
    audioContext.suspend();
    setTimestamps([]);
    setTimer(0);
    setShouldReset(true);
  };

  const bpm = offsets.length ? 60 / weightedMovingAverage(offsets) : 0;

  useInterval(() => {
    if (timer <= DELAY) {
      return setShouldReset(true);
    }

    setTimer((state) => state - DELAY);
  }, DELAY);

  return (
    <div className="container flex flex-col ">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">BPM Tapper</h2>
        <Card className="item flex flex-col justify-center gap-8 p-8">
          <TapButton bpm={bpm} onTap={handleTap} />
          <ResetButton
            percentage={percentage(timer, 0, RESET_TIME)}
            onReset={handleReset}
          />
        </Card>
      </div>
    </div>
  );
};

export default BpmTapper;
