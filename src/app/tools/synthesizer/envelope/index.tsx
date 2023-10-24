import { useMemo, useRef } from "react";
import { Adsr, useAdsrContext } from "@/contexts/adsr";
import useElementSize from "@/hooks/use-element-size";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AdsrDisplay from "@/app/tools/synthesizer/envelope/adsr-display";
import CircularSlider from "@/components/ui/circular-slider";
import { exponentialToLinear, linearToExponential } from "@/utils/math";

const MIN_TIME = 0;
const MAX_TIME = 5;

const Envelope = () => {
  const { adsr, onAdsrChange } = useAdsrContext();

  const handleAdsrTimeChange = (percentage: number, property: keyof Adsr) => {
    const time = linearToExponential(percentage, MIN_TIME, MAX_TIME, 0, 100, 3);
    onAdsrChange({ ...adsr, [property]: time });
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { width: containerWidth } = useElementSize(containerRef);

  const attackPercentage = useMemo(
    () => exponentialToLinear(adsr.attack, MIN_TIME, MAX_TIME, 0, 100, 3),
    [adsr],
  );

  const decayPercentage = useMemo(
    () => exponentialToLinear(adsr.decay, MIN_TIME, MAX_TIME, 0, 100, 3),
    [adsr],
  );

  const releasePercentage = useMemo(
    () => exponentialToLinear(adsr.release, MIN_TIME, MAX_TIME, 0, 100, 3),
    [adsr],
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Envelope</h3>
      </CardHeader>
      <CardContent className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div ref={containerRef}>
          <AdsrDisplay
            width={containerWidth ?? 0}
            height={96}
            attack={attackPercentage / 100}
            decay={decayPercentage / 100}
            sustain={adsr.sustain}
            release={releasePercentage / 100}
          />
        </div>
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-2 md:grid-cols-4"
        >
          <div className="flex flex-col items-center gap-2">
            <p>Attack</p>
            <CircularSlider
              value={attackPercentage}
              onChange={(value) => handleAdsrTimeChange(value, "attack")}
              range={0.8}
              size={64}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Decay</p>
            <CircularSlider
              value={decayPercentage}
              onChange={(value) => handleAdsrTimeChange(value, "decay")}
              range={0.8}
              size={64}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Sustain</p>
            <CircularSlider
              value={adsr.sustain}
              onChange={(value) => onAdsrChange({ ...adsr, sustain: value })}
              min={0}
              max={1}
              step={0.01}
              range={0.8}
              size={64}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Release</p>
            <CircularSlider
              value={releasePercentage}
              onChange={(value) => handleAdsrTimeChange(value, "release")}
              range={0.8}
              size={64}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Envelope;
