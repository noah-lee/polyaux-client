import { useState } from "react";
import DelayEffectNode from "@/audio/delay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CircularSlider from "@/components/ui/circular-slider";
import { Switch } from "@/components/ui/switch";

type Props = {
  delay: DelayEffectNode;
};

const Delay = ({ delay }: Props) => {
  const [delayTime, setDelayTime] = useState(delay.delayTime);
  const [feedback, setFeedback] = useState(delay.feedback);
  const [mix, setMix] = useState(delay.mix);
  const [bypass, setBypass] = useState(delay.bypass);

  const handleDelayTimeChange = (delayTime: number) => {
    delay.delayTime = delayTime;
    setDelayTime(delay.delayTime);
  };

  const handleFeedbackChange = (feedback: number) => {
    delay.feedback = feedback;
    setFeedback(delay.feedback);
  };

  const handleMixChange = (mix: number) => {
    delay.mix = mix;
    setMix(delay.mix);
  };

  const handleBypassChange = (checked: boolean) => {
    delay.bypass = !checked;
    setBypass(delay.bypass);
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <h3 className="text-lg font-semibold">Delay</h3>
        <Switch checked={!bypass} onCheckedChange={handleBypassChange} />
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <div className="flex items-start justify-evenly gap-8">
          <div className="flex flex-col items-center gap-2">
            <p>Delay Time</p>
            <CircularSlider
              value={delayTime}
              onChange={handleDelayTimeChange}
              min={0}
              max={5}
              step={0.01}
              range={0.8}
              size={64}
              disabled={bypass}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p>Feedback</p>
            <CircularSlider
              value={feedback}
              onChange={handleFeedbackChange}
              min={0}
              max={1}
              step={0.01}
              range={0.8}
              size={64}
              disabled={bypass}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Mix</p>
          <CircularSlider
            value={mix}
            onChange={handleMixChange}
            min={0}
            max={1}
            step={0.01}
            range={0.8}
            size={64}
            disabled={bypass}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Delay;
