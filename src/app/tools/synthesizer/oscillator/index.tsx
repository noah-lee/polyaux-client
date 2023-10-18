import { useState } from "react";
import OctaveSelector from "@/app/tools/synthesizer/oscillator/octave-selector";
import TypeSelector from "@/app/tools/synthesizer/oscillator/type-selector";
import MonoOscillator from "@/audio/mono-oscillator";
import PolyOscillator from "@/audio/poly-oscillator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CircularSlider from "@/components/ui/circular-slider";

type Props = {
  oscillator: MonoOscillator | PolyOscillator;
};

const Oscillator = ({ oscillator }: Props) => {
  const [type, setType] = useState(oscillator.type);
  const [gain, setGain] = useState(oscillator.gain);
  const [octave, setOctave] = useState(oscillator.octave);

  const handleTypeChange = (type: OscillatorType) => {
    oscillator.type = type;
    setType(oscillator.type);
  };

  const handleGainChange = (gain: number) => {
    oscillator.gain = gain;
    setGain(oscillator.gain);
  };

  const handleOctaveIncrement = () => {
    oscillator.octave++;
    setOctave(oscillator.octave);
  };

  const handleOctaveDecrement = () => {
    oscillator.octave--;
    setOctave(oscillator.octave);
  };

  return (
    <Card className="flex-grow">
      <CardHeader>
        <h3 className="font-semibold text-lg">Oscillator</h3>
      </CardHeader>
      <CardContent className="flex gap-8 flex-wrap justify-center items-center">
        <TypeSelector type={type} onTypeChange={handleTypeChange} />
        <OctaveSelector
          octave={octave}
          onDecrement={handleOctaveDecrement}
          onIncrement={handleOctaveIncrement}
        />
        <div className="flex flex-col gap-2 items-center">
          <p>Gain</p>
          <CircularSlider
            value={gain}
            onChange={handleGainChange}
            max={1}
            step={0.01}
            range={0.8}
            size={64}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Oscillator;
