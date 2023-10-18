import { DiamondIcon, PlusIcon, SquareIcon } from "lucide-react";
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
    <div className="grid grid-cols-4">
      {Array(beats)
        .fill(0)
        .map((_, index) =>
          index === 0 ? (
            <Button key={index} size="icon" variant="ghost" className="pointer-events-none">
              <SquareIcon
                className={cn(
                  previousBeat === index && isPlaying && "fill-primary",
                )}
              />
            </Button>
          ) : (
            <Button
              key={index}
              size="icon"
              variant="ghost"
              onClick={onDecrement}
            >
              <DiamondIcon
                className={cn(
                  previousBeat === index && isPlaying && "fill-primary",
                )}
              />
            </Button>
          ),
        )}
      {beats < MAX_BEATS && (
        <Button size="icon" variant="secondary" onClick={onIncrement}>
          <PlusIcon />
        </Button>
      )}
    </div>
  );
};

export default BeatsControl;
