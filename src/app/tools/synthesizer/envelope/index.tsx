import { useRef } from "react";
import { useAdsrContext } from "@/contexts/adsr";
import useElementSize from "@/hooks/use-element-size";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AdsrDisplay from "@/app/tools/synthesizer/envelope/adsr-display";
import CircularSlider from "@/components/ui/circular-slider";

const Envelope = () => {
  const { adsr, onAdsrChange } = useAdsrContext();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { width: containerWidth } = useElementSize(containerRef);

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
            attack={adsr.attack / 5}
            decay={adsr.decay / 5}
            sustain={adsr.sustain / 1}
            release={adsr.release / 5}
          />
        </div>
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-2 md:grid-cols-4"
        >
          <div className="flex flex-col items-center gap-2">
            <p>Attack</p>
            <CircularSlider
              value={adsr.attack}
              onChange={(value) => onAdsrChange({ ...adsr, attack: value })}
              min={0}
              max={5}
              step={0.01}
              range={0.8}
              size={64}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Decay</p>
            <CircularSlider
              value={adsr.decay}
              onChange={(value) => onAdsrChange({ ...adsr, decay: value })}
              min={0}
              max={5}
              step={0.01}
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
              value={adsr.release}
              onChange={(value) => onAdsrChange({ ...adsr, release: value })}
              min={0}
              max={5}
              step={0.01}
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
