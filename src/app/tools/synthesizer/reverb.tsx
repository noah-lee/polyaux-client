import { useState } from "react";
import ReverbEffectNode from "@/audio/reverb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CircularSlider from "@/components/ui/circular-slider";
import { Switch } from "@/components/ui/switch";

type Props = {
  reverb: ReverbEffectNode;
};

const Reverb = ({ reverb }: Props) => {
  const [decay, setDecay] = useState(reverb.decay);
  const [mix, setMix] = useState(reverb.mix);
  const [bypass, setBypass] = useState(reverb.bypass);

  const handleDecayChange = (decay: number) => {
    reverb.decay = decay;
    setDecay(reverb.decay);
  };

  const handleMixChange = (mix: number) => {
    reverb.mix = mix;
    setMix(reverb.mix);
  };

  const handleBypassChange = (checked: boolean) => {
    reverb.bypass = !checked;
    setBypass(reverb.bypass);
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <h3 className="text-lg font-semibold">Reverb</h3>
        <Switch checked={!bypass} onCheckedChange={handleBypassChange} />
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <p>Decay</p>
          <CircularSlider
            value={decay}
            onChange={handleDecayChange}
            min={0}
            max={5}
            step={0.01}
            range={0.8}
            size={64}
            disabled={bypass}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Mix</p>
          <CircularSlider
            value={mix}
            onChange={handleMixChange}
            min={0}
            max={1}
            step={0.01}
            range={0.8}
            size={64}
            disabled={bypass}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Reverb;
