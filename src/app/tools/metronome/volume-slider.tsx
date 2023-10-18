import { Slider } from "@/components/ui/slider";
import { Volume2Icon } from "lucide-react";

type Props = {
  volume: number;
  onVolumeChange: (volume: number) => void;
};

export const VolumeSlider = ({ volume, onVolumeChange }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Volume2Icon />
      <Slider
        value={[volume]}
        onValueChange={(values) => onVolumeChange(values[0])}
        max={1}
        step={0.01}
      />
    </div>
  );
};
