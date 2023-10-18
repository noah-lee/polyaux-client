import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";
import { MinusIcon, PlusIcon } from "lucide-react";

type Props = {
  octave: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

const OctaveSelector = ({ octave, onDecrement, onIncrement }: Props) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <p>Octave</p>
      <div className="flex gap-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-[12px] w-[20px] border rounded",
                index === octave + 2 && "bg-primary"
              )}
            ></div>
          ))}
      </div>
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onDecrement}
          disabled={octave === -2}
        >
          <MinusIcon width={12} height={12} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onIncrement}
          disabled={octave === 2}
        >
          <PlusIcon width={12} height={12} />
        </Button>
      </div>
    </div>
  );
};

export default OctaveSelector;
