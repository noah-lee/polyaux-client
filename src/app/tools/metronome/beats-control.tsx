import { DiamondIcon, MinusIcon, PlusIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";

const MAX_BEATS = 16;

type Props = {
  beats: number;
  isPlaying: boolean;
  previousBeat: number | undefined;
  onIncrement: () => void;
  onDecrement: () => void;
};

const BeatsControl = ({
  beats,
  isPlaying,
  previousBeat,
  onIncrement,
  onDecrement,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={onDecrement}
          disabled={beats <= 1}
        >
          <MinusIcon />
        </Button>
        <p className="text-xl font-semibold">{beats}</p>
        <Button
          size="icon"
          variant="secondary"
          onClick={onIncrement}
          disabled={beats >= MAX_BEATS}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="grid grid-cols-4 justify-items-center">
        {Array(beats)
          .fill(0)
          .map((_, index) => (
            <Button
              key={index}
              size="icon"
              variant="ghost"
              className="pointer-events-none"
            >
              {index === 0 ? (
                <DiamondIcon
                  className={cn(
                    previousBeat === index && isPlaying && "fill-primary",
                  )}
                />
              ) : (
                <SquareIcon
                  className={cn(
                    previousBeat === index && isPlaying && "fill-primary",
                  )}
                />
              )}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default BeatsControl;
