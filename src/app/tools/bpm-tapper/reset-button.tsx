import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onReset: () => void;
};

const ResetButton = ({ onReset }: Props) => {
  return (
    <Button variant="destructive" onClick={onReset}>
      <RotateCcwIcon />
    </Button>
  );
};

export default ResetButton;
