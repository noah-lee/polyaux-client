import { PauseIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isPlaying: boolean;
  onToggle: () => void;
};

const PlayPauseButton = ({ isPlaying, onToggle }: Props) => {
  return (
    <Button
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
        }
      }}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};

export default PlayPauseButton;
