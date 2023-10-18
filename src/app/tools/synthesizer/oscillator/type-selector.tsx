import SawtoothWaveIcon from "@/components/icons/sawtooth-wave-icon";
import SineWaveIcon from "@/components/icons/sine-wave-icon";
import SquareWaveIcon from "@/components/icons/square-wave-icon";
import TriangleWaveIcon from "@/components/icons/triangle.wave-icon";
import { Button } from "@/components/ui/button";

type Props = {
  type: OscillatorType;
  onTypeChange: (type: OscillatorType) => void;
};

const TypeSelector = ({ type, onTypeChange }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      <Button
        variant={type === "sine" ? "default" : "secondary"}
        className="w-[64px] h-[64px]"
        onClick={() => onTypeChange("sine")}
      >
        <SineWaveIcon />
      </Button>
      <Button
        variant={type === "triangle" ? "default" : "secondary"}
        className="w-[64px] h-[64px]"
        onClick={() => onTypeChange("triangle")}
      >
        <TriangleWaveIcon />
      </Button>
      <Button
        variant={type === "square" ? "default" : "secondary"}
        className="w-[64px] h-[64px]"
        onClick={() => onTypeChange("square")}
      >
        <SquareWaveIcon />
      </Button>
      <Button
        variant={type === "sawtooth" ? "default" : "secondary"}
        className="w-[64px] h-[64px]"
        onClick={() => onTypeChange("sawtooth")}
      >
        <SawtoothWaveIcon />
      </Button>
    </div>
  );
};

export default TypeSelector;
