import CircularSlider from "@/components/ui/circular-slider";

const MIN_TEMPO = 40;
const MAX_TEMPO = 240;

type Props = {
  tempo: number;
  onTempoChange: (tempo: number) => void;
};

const TempoSlider = ({ tempo, onTempoChange }: Props) => {
  return (
    <div className="relative">
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold">
        {tempo}
      </p>
      <CircularSlider
        range={0.8}
        value={tempo}
        onChange={onTempoChange}
        min={MIN_TEMPO}
        max={MAX_TEMPO}
        size={196}
      />
    </div>
  );
};

export default TempoSlider;
