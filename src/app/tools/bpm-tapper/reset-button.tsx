import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useKeyDown from "@/hooks/use-key-down";
import "@/styles/index.css";

type Props = {
  percentage: number;
  onReset: () => void;
};

const ResetButton = ({ percentage, onReset }: Props) => {
  useKeyDown((event) => !event.repeat && event.key === "Escape" && onReset());

  return (
    <Button
      variant="secondary"
      onClick={onReset}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
        }
      }}
      style={{
        background: `linear-gradient(90deg, hsl(var(--destructive)) ${(
          percentage * 100
        ).toFixed()}%, hsl(var(--secondary)) 0%`,
      }}
    >
      <RotateCcwIcon />
    </Button>
  );
};

export default ResetButton;
