import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styles";
import { UploadIcon } from "lucide-react";
import {
  InputHTMLAttributes,
  ReactNode,
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
} from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  className?: string;
  onFileChange?: (files: FileList | null) => void;
};

const DragDrop = ({ children, className, onFileChange, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const isChild = event.currentTarget.contains(event.relatedTarget as Node);
    if (isChild) {
      return;
    }
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onFileChange?.(event.dataTransfer.files);
    setIsDragging(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange?.(event.target.files);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 border border-dashed p-8 rounded-lg",
        isDragging && "bg-muted/20",
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        {...props}
        className="hidden"
        onChange={handleChange}
      />
      {children || (
        <>
          <UploadIcon />
          <p className="font-medium">Drag & Drop File </p>
          <p className="text-sm">or</p>
          <Button onClick={handleClick}>Browse</Button>
        </>
      )}
    </div>
  );
};

export default DragDrop;
