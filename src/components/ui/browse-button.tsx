import { Button, ButtonProps } from "@/components/ui/button";
import { useRef } from "react";

type Props = ButtonProps & {
  onClick?: void;
  accept?: string;
  onFileChange?: (files: FileList | null) => void;
};

const BrowseButton = ({ onFileChange, accept, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Button {...props} onClick={handleClick}>
        Browse
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(event) => onFileChange?.(event.target.files)}
      />
    </>
  );
};

export default BrowseButton;
