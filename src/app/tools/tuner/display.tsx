import { cn } from "@/utils/styles";

const SVG_PADDING = 0.8;

type Props = {
  width: number;
  height: number;
  percentage: number;
  disabled?: boolean;
};

const TunerDisplay = ({ width, height, percentage, disabled }: Props) => {
  const w = width * SVG_PADDING;
  const h = height * SVG_PADDING;

  const x1 = width * (1 - SVG_PADDING) * 0.5;
  const x2 = x1 + w * 0.5;
  const x3 = x1 + w;
  const x = threePointsCurveToCoordinate(percentage, x1, x2, x3);

  const y1 = height * (1 - (1 - SVG_PADDING) * 0.5);
  const y2 = y1 - h;
  const y3 = y1;
  const y = threePointsCurveToCoordinate(percentage, y1, y2, y3);

  return (
    <svg width={width} height={height} strokeLinecap="round">
      <path
        d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
        strokeWidth={10}
        fill="none"
        className="stroke-muted"
      />
      <circle
        cx={x}
        cy={y}
        r={16}
        className={cn(
          "fill-background stroke-primary stroke-2",
          disabled && "stroke-primary/50",
        )}
      />
    </svg>
  );
};

export default TunerDisplay;

const threePointsCurveToCoordinate = (
  t: number,
  p1: number,
  p2: number,
  p3: number,
) => Math.pow(1 - t, 2) * p1 + 2 * (1 - t) * t * p2 + Math.pow(t, 2) * p3;
