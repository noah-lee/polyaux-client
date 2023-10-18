import { cn } from "@/utils/styles";

type Props = {
  width: number;
  height: number;
  filterType: BiquadFilterType;
  percentage: number;
  disabled?: boolean;
};

const FilterDisplay = ({
  width,
  height,
  filterType,
  percentage,
  disabled,
}: Props) => {
  const paths = () => {
    switch (filterType) {
      case "lowpass":
        return (
          <path
            d={`M 0 ${height * 0.25} l ${width * percentage} 0 
              q ${width * 0.125} 0 ${width * 0.25} ${height * 0.75}`}
          />
        );
      case "highpass":
        return (
          <>
            <path
              d={`M ${width * percentage} ${height * 0.25} 
                q -${width * 0.125} 0 -${width * 0.25} ${height * 0.75}`}
            />
            <path
              d={`M ${width * percentage} ${height * 0.25} 
                ${width} ${height * 0.25}`}
            />
          </>
        );
      case "bandpass":
        return (
          <>
            <path
              d={`M ${width * percentage} ${height * 0.25} 
                q -${width * 0.125} 0 -${width * 0.25} ${height * 0.75}`}
            />
            <path
              d={`M ${width * percentage} ${height * 0.25} 
                q ${width * 0.125} 0 ${width * 0.25} ${height * 0.75} `}
            />
          </>
        );
      case "notch":
        return (
          <>
            <path
              d={`M ${width * percentage} ${height * 0.95} 
              q -${width * 0.125} 0
              -${width * 0.25} -${height * 0.7} L 0 ${height * 0.25}`}
            />
            <path
              d={`M ${width * percentage} ${height * 0.95} 
              q ${width * 0.125} 0
              ${width * 0.25} -${height * 0.7} L ${width} ${height * 0.25}`}
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

export default FilterDisplay;
