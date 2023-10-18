import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useKeyDown from "@/hooks/use-key-down";
import { cn } from "@/utils/styles";

type Props = {
  bpm: number;
  onTap: () => void;
};

const TapButton = ({ bpm, onTap }: Props) => {
  const [animate, setAnimate] = useState(false);

  const handleTap = () => {
    onTap();
    setAnimate(true);
  };

  useKeyDown((event) => !event.repeat && event.key === " " && handleTap());

  return (
    <Button
      onClick={handleTap}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
        }
      }}
      className={cn(
        "h-[196px] w-[196px] rounded-full text-5xl",
        animate && "animate-[squeeze_0.1s_ease-in]",
      )}
      onAnimationEnd={() => setAnimate(false)}
    >
      {!bpm ? "Tap" : bpm.toFixed()}
    </Button>
  );
};

export default TapButton;
