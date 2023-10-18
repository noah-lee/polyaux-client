import { cn } from "@/utils/styles";

type Props = {
  width: number;
  height: number;
  lfoType: OscillatorType;
  percentageX: number;
  percentageY: number;
  disabled?: boolean;
};

const LfoDisplay = ({
  width,
  height,
  lfoType,
  percentageX,
  percentageY,
  disabled,
}: Props) => {
  const centerX = width * 0.5;
  const centerY = height * 0.5;

  const spanX = width * 0.25 + width * 0.7 * (1 - percentageX);
  const spanY = height * 0.25 + height * 0.7 * percentageY;

  const paths = () => {
    switch (lfoType) {
      case "sine":
        return (
          <>
            <path
              d={`M ${centerX} ${centerY} 
              q -${spanX * 0.125} ${spanY * 0.5} 
              -${spanX * 0.25} ${spanY * 0.5} 
              q -${spanX * 0.125} 0 
              -${spanX * 0.25} -${spanY * 0.5}`}
            />
            <path
              d={`M ${centerX} ${centerY} 
              q ${spanX * 0.125} -${spanY * 0.5} 
              ${spanX * 0.25} -${spanY * 0.5} 
              q ${spanX * 0.125} 0 
              ${spanX * 0.25} ${spanY * 0.5}`}
            />
          </>
        );

      case "square":
        return (
          <>
            <path
              d={`M ${centerX} ${centerY} 
              l 0 ${spanY * 0.5} 
              -${spanX * 0.5} 0 
              0 -${spanY * 0.5}`}
            />
            <path
              d={`M ${centerX} ${centerY} 
              l 0 -${spanY * 0.5} 
              ${spanX * 0.5} 0 
              0 ${spanY * 0.5}`}
            />
          </>
        );

      case "triangle":
        return (
          <>
            <path
              d={`M ${centerX} ${centerY} 
              l -${spanX * 0.25} ${spanY * 0.5} 
              l -${spanX * 0.25} -${spanY * 0.5}`}
            />
            <path
              d={`M ${centerX} ${centerY} 
              l ${spanX * 0.25} -${spanY * 0.5} 
              l ${spanX * 0.25} ${spanY * 0.5}`}
            />
          </>
        );

      case "sawtooth":
        return (
          <>
            <path
              d={`M ${centerX} ${centerY} 
              l -${spanX * 0.5} ${spanY * 0.5} 
              l 0 -${spanY * 0.5}`}
            />
            <path
              d={`M ${centerX} ${centerY} 
              l ${spanX * 0.5} -${spanY * 0.5} 
              l 0 ${spanY * 0.5}`}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={width}
      height={height}
      className={cn(
        "disabled rounded-sm bg-secondary fill-none stroke-primary stroke-2",
        disabled ? "stroke-muted" : "",
      )}
    >
      {paths()}
    </svg>
  );
};

export default LfoDisplay;
