import { clamp } from "@/utils/math";

type Props = {
  width: number;
  height: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

const AdsrDisplay = ({
  width,
  height,
  attack,
  decay,
  sustain,
  release,
}: Props) => {
  const clampedAttack = clamp(attack, 0.1, 1);
  const clampedDecay = clamp(decay, 0.1, 1);
  const clampedRelease = clamp(release, 0.1, 1);

  return (
    <svg
      width={width}
      height={height}
      className="overflow-hidden rounded-sm bg-secondary fill-none stroke-primary stroke-2"
    >
      <path
        d={`
      M 0 ${height} 
      l ${width * (1 / 3) * clampedAttack} ${-height * 0.75} 
      l ${width * (1 / 3) * clampedDecay} ${height * (1 - sustain) * 0.75}
      l ${width * (1 / 4)} 0
      l ${width * (1 / 3) * clampedRelease} ${height * sustain}
      `}
      />
    </svg>
  );
};

export default AdsrDisplay;
