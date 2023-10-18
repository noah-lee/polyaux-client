import { useRef, useState } from "react";
import LfoNode from "@/audio/lfo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useElementSize from "@/hooks/use-element-size";
import LfoDisplay from "@/app/tools/synthesizer/lfo/lfo-display";
import { percentage } from "@/utils/math";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CircularSlider from "@/components/ui/circular-slider";

const LFO_FREQUENCY_MIN = 0.1;
const LFO_FREQUENCY_MAX = 10;

type Props = {
  lfo: LfoNode;
};

const Lfo = ({ lfo }: Props) => {
  const [type, setType] = useState<OscillatorType>(lfo.type);
  const [frequency, setFrequency] = useState(lfo.frequency);
  const [amplitude, setAmplitude] = useState(lfo.amplitude);
  const [bypass, setBypass] = useState(lfo.bypass);

  const handleTypeChange = (type: OscillatorType) => {
    lfo.type = type;
    setType(lfo.type);
  };

  const handleFrequencyChange = (frequency: number) => {
    lfo.frequency = frequency;
    setFrequency(lfo.frequency);
  };

  const handleAmplitudeChange = (amplitude: number) => {
    lfo.amplitude = amplitude;
    setAmplitude(lfo.amplitude);
  };

  const handleBypassChange = (checked: boolean) => {
    lfo.bypass = !checked;
    setBypass(lfo.bypass);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { width: containerWidth } = useElementSize(containerRef);

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <h3 className="text-lg font-semibold">LFO</h3>
        <Switch checked={!bypass} onCheckedChange={handleBypassChange} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={type} onValueChange={handleTypeChange} disabled={bypass}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sine">Sine</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
              <SelectItem value="sawtooth">Sawtooth</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div ref={containerRef}>
          <LfoDisplay
            width={containerWidth ?? 0}
            height={96}
            lfoType={type}
            percentageX={percentage(
              frequency,
              LFO_FREQUENCY_MIN,
              LFO_FREQUENCY_MAX,
            )}
            percentageY={amplitude}
            disabled={bypass}
          />
        </div>
        <div className="flex justify-evenly gap-8">
          <div className="flex flex-col items-center gap-2">
            <p>Frequency</p>
            <CircularSlider
              value={frequency}
              onChange={handleFrequencyChange}
              min={LFO_FREQUENCY_MIN}
              max={LFO_FREQUENCY_MAX}
              step={0.1}
              range={0.8}
              size={64}
              disabled={bypass}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Amplitude</p>
            <CircularSlider
              value={amplitude}
              onChange={handleAmplitudeChange}
              max={1}
              step={0.01}
              range={0.8}
              size={64}
              disabled={bypass}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Lfo;
