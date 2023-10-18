import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  integrated: number;
  short: number;
  momentary: number;
  progress: number;
  loading?: boolean;
};

const LoudnessDisplay = ({
  integrated,
  short,
  momentary,
  progress,
  loading,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Loudness (LUFS)</h3>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {loading ? (
          <Progress value={progress * 100} className="my-[16px]" />
        ) : (
          <span className="justify-self-end text-5xl font-bold text-primary">
            {integrated.toFixed(1)}
          </span>
        )}
        <div className="grid w-full grid-cols-2 gap-2">
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
