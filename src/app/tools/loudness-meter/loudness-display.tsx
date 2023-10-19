import BrowseButton from "@/components/ui/browse-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  integrated: number;
  short: number;
  momentary: number;
  progress: number;
  onFileChange: (files: FileList | null) => void;
  loading?: boolean;
};

const LoudnessDisplay = ({
  integrated,
  short,
  momentary,
  progress,
  onFileChange,
  loading,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="relative">
          <h3 className="text-lg font-semibold">Loudness (LUFS)</h3>
          <BrowseButton
            size="sm"
            onFileChange={onFileChange}
            accept="audio/*"
            disabled={loading}
            className="absolute right-0 top-0"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {loading ? (
          <Progress value={progress * 100} className="my-[16px]" />
        ) : (
          <span className="justify-self-end text-5xl font-bold text-primary">
            {integrated.toFixed(1)}
          </span>
        )}
        <div className="grid w-full grid-cols-2">
          <span>Short: </span>
          <span className="justify-self-end whitespace-nowrap text-primary">
            {short.toFixed(1)}
          </span>
          <span>Momentary: </span>
          <span className="justify-self-end whitespace-nowrap text-primary">
            {momentary.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoudnessDisplay;
