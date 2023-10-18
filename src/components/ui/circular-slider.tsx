import { cn } from "@/utils/styles";
import {
  createContext,
  useRef,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

// Context

export type CircularSliderContextProps = {
  value: number;
  onValueChange: (event: PointerEvent | React.PointerEvent) => void;
  min: number;
  max: number;
  range: number;
  size: number;
  thickness: number;
  diameter: number;
  inverted: boolean;
  readOnly: boolean;
  disabled: boolean;
};

const CircularSliderContext = createContext<CircularSliderContextProps>(
  {} as CircularSliderContextProps
);

export const useCircularSliderContext = () => useContext(CircularSliderContext);

export type CircularSliderProps = {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: number;
  size?: number;
  thickness?: number;
  inverted?: boolean;
  children?: ReactNode;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
};

// Circuler Slider

const CircularSlider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  range = 1,
  size = 48,
  thickness = 8,
  inverted = false,
  readOnly = false,
  disabled = false,
  children,
  onChange,
  className,
}: CircularSliderProps) => {
  const containerRef = useRef<SVGSVGElement>(null);

  const diameter = size - thickness;

  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = useCallback(
    (event: PointerEvent | React.PointerEvent) => {
      const newValue = eventToValue(
        event,
        min,
        max,
        range,
        diameter,
        containerRef.current
      );

      if (newValue === undefined) return;
      const newSnappedValue = Math.round(newValue / step) * step;
      setInternalValue(newSnappedValue);
      onChange?.(newSnappedValue);
    },
    [min, max, range, diameter, containerRef, onChange, step]
  );

  const handleClick = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      handleValueChange(event);
    },
    [handleValueChange]
  );

  const handlePointerDown = (event: React.PointerEvent) => {
    handleValueChange(event);

    const handlePointerMove = (event: PointerEvent) => {
      handleValueChange(event);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<SVGSVGElement>) => {
      const { key } = event;

      const isIncrement = key === "ArrowUp" || key === "ArrowRight";
      const isDecrement = key === "ArrowDown" || key === "ArrowLeft";

      if (isDecrement) {
        setInternalValue(Math.max(min, internalValue - step));
        onChange?.(Math.max(min, internalValue - step));
      }

      if (isIncrement) {
        setInternalValue(Math.min(max, internalValue + step));
        onChange?.(Math.min(max, internalValue + step));
      }
    },
    [internalValue, min, max, step, onChange]
  );

  return (
    <CircularSliderContext.Provider
      value={{
        value: internalValue,
        onValueChange: handleValueChange,
        min,
        max,
        range,
        size,
        thickness: thickness,
        diameter,
        inverted,
        readOnly,
        disabled,
      }}
    >
      <svg
        tabIndex={readOnly || disabled ? -1 : 0}
        role="slider"
        ref={containerRef}
        width={size}
        height={size}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        style={{
          overflow: "visible",
          touchAction: "none",
          display: "inline-block",
        }}
        className={cn(
          "focus:outline-none focus-visible:ring cursor-pointer",
          (readOnly || disabled) && "pointer-events-none",
          className
        )}
      >
        {children || (
          <>
            <CircularTrack />
            <CircularProgress />
            {!readOnly && <CircularThumb />}
          </>
        )}
      </svg>
    </CircularSliderContext.Provider>
  );
};

export default CircularSlider;

// Circular Progress

export const CircularProgress = ({ className }: { className?: string }) => {
  const {
    value,
    min,
    max,
    range,
    size,
    thickness,
    diameter,
    inverted,
    disabled,
  } = useCircularSliderContext();

  const circumference = (toRadians(360) * diameter) / 2;

  const progressPercentage = inverted
    ? -toPercentage(value, min, max) * range - (1 - range)
    : 1 - toPercentage(value, min, max) * range;

  const rangeOffset = ((1 - range) / 2) * 360;

  return (
    <circle
      fill="none"
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={circumference * progressPercentage}
      transform={`rotate(${
        inverted ? -OFFSET_ANGLE - rangeOffset : -OFFSET_ANGLE + rangeOffset
      } 
      ${size / 2} ${size / 2})`}
      cx={size / 2}
      cy={size / 2}
      r={diameter / 2}
      className={cn("stroke-primary", disabled && "opacity-50", className)}
    />
  );
};

// Circular Thumb

export const CircularThumb = ({ className }: { className?: string }) => {
  const {
    value,
    min,
    max,
    range,
    size,
    thickness,
    diameter,
    disabled,
  }: CircularSliderContextProps = useCircularSliderContext();

  const { x, y } = useMemo(
    () => valueToPosition(value, min, max, range, size, diameter),
    [value, min, max, range, size, diameter]
  );

  return (
    <circle
      r={thickness}
      cx={x}
      cy={y}
      className={cn(
        "fill-background stroke-primary stroke-2",
        disabled && "stroke-primary/50",
        className
      )}
    />
  );
};

// Circular Track

export const CircularTrack = ({ className }: { className?: string }) => {
  const { range, size, thickness, diameter } = useCircularSliderContext();

  const circumference = (toRadians(360) * diameter) / 2;

  return (
    <circle
      fill="none"
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeDasharray={`${circumference * range} 360`}
      transform={`rotate(-${OFFSET_ANGLE - ((1 - range) / 2) * 360} 
  ${size / 2} ${size / 2})`}
      cx={size / 2}
      cy={size / 2}
      r={diameter / 2}
      className={cn("stroke-secondary", className)}
    />
  );
};

// Utils

export const OFFSET_ANGLE = 270;

export type Cartesian = {
  x: number;
  y: number;
};

export type Polar = {
  radius: number;
  radians: number;
};

/**
 * Convert circular slider value to position (top, left)
 * @param value
 * @param min
 * @param max
 * @param range
 * @param size
 * @param diameter
 * @returns
 */
const valueToPosition = (
  value: number,
  min: number,
  max: number,
  range: number,
  size: number,
  diameter: number
) => {
  const radius = diameter / 2;
  const percentage = toPercentage(value, min, max); // Value to percentage
  const radians = percentageToRadians(percentage, range); // Percentage to radians
  const vector = toCartesian(radius, radians); // Radians to cartesian coordinates
  return {
    x: size / 2 + vector.x,
    y: size / 2 - vector.y,
  } as Cartesian;
};

/**
 * Convert touch event to circular slider value
 * @param event
 * @param min
 * @param max
 * @param range
 * @param diameter
 * @param container
 * @returns
 */
const eventToValue = (
  event: PointerEvent | React.PointerEvent,
  min: number,
  max: number,
  range: number,
  diameter: number,
  container: Element | null | undefined
) => {
  if (!container) return;
  const eventPosition = eventToPosition(event, container); // Touch event to cartesian coordinates
  const radians = positionToRadians(eventPosition, diameter); // Cartesian coordinates to radians
  return radiansToValue(radians, min, max, range); // Radians to value
};

/**
 * Convert angle in degrees to radians
 * @param degrees
 * @returns
 */
export const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Convert angle in radians to degrees
 * @param radians
 * @returns
 */
export const toDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};

/**
 * Convert value to percentage
 * @param value
 * @param min
 * @param max
 * @returns
 */
export const toPercentage = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

/**
 * Convert percentage to value
 * @param percentage
 * @param min
 * @param max
 * @returns
 */
export const toValue = (percentage: number, min: number, max: number) => {
  return percentage * (max - min) + min;
};

/**
 * Convert percentage to angle in radians
 * @param percentage
 * @param start
 * @param end
 * @returns
 */
export const percentageToRadians = (percentage: number, range: number) => {
  const offsetRadians = toRadians(OFFSET_ANGLE);
  const rangeRadians = range * toRadians(360);
  const percentageRadians = percentage * rangeRadians;
  const deadzoneRadians = (1 - range) * toRadians(360);

  const correction =
    percentageRadians + deadzoneRadians / 2 > offsetRadians
      ? toRadians(360)
      : 0;

  return offsetRadians - deadzoneRadians / 2 - percentageRadians + correction;
};

/**
 * Convert radius and radians to cartesian coordinates
 * @param radius
 * @param radians
 * @returns Coordinates
 */
export const toCartesian = (radius: number, radians: number) => {
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  } as Cartesian;
};

/**
 * Convert cartesian coordinates to polar radius and radians
 * @param cartesian
 * @returns
 */
export const toPolar = (cartesian: Cartesian) => {
  const { x, y } = cartesian;

  const radius = Math.sqrt(x ** 2 + y ** 2);

  let offset = 0;
  if (x < 0) {
    offset = toRadians(180);
  } else if (y < 0) {
    offset = toRadians(360);
  }
  const radians = Math.atan(y / x) + offset;

  return { radius, radians } as Polar;
};

/**
 * Convert touch event to position (top, left)
 * @param event
 * @param container
 * @returns
 */
export const eventToPosition = (
  event: PointerEvent | React.PointerEvent,
  container: Element
) => {
  const { clientX: eventPositionX, clientY: eventPositionY } = event;
  const { x: containerLeft, y: containerTop } =
    container.getBoundingClientRect();
  return {
    x: eventPositionX - containerLeft,
    y: eventPositionY - containerTop,
  };
};

/**
 * Convert position to radians
 * @param position
 * @param diameter
 * @returns
 */
export const positionToRadians = (position: Cartesian, diameter: number) => {
  const center = {
    x: diameter / 2,
    y: diameter / 2,
  };
  const eventFromCenter = {
    x: position.x - center.x,
    y: -(position.y - center.y),
  };
  const { radians } = toPolar(eventFromCenter);
  return radians;
};

/**
 * Convert radians to circular slider value
 * @param radians
 * @param min
 * @param max
 * @param range
 * @returns
 */
export const radiansToValue = (
  radians: number,
  min: number,
  max: number,
  range: number
) => {
  const offsetRadians = toRadians(OFFSET_ANGLE);
  const deadzoneRadians = (1 - range) * toRadians(360);

  const correction =
    radians + deadzoneRadians / 2 > offsetRadians ? toRadians(360) : 0;

  let percentageRadians = -(
    radians -
    offsetRadians +
    deadzoneRadians / 2 -
    correction
  );

  const rangeRadians = range * toRadians(360);

  if (percentageRadians > rangeRadians) {
    percentageRadians =
      percentageRadians > rangeRadians + deadzoneRadians / 2 ? 0 : rangeRadians;
  }

  const percentage = percentageRadians / rangeRadians;
  return toValue(percentage, min, max);
};
