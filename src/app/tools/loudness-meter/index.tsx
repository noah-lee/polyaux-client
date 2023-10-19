import { useState, useEffect } from "react";
import LoudnessDisplay from "@/app/tools/loudness-meter/loudness-display";
import PlatformPlayer from "@/app/tools/loudness-meter/platform-player";
import LoudnessMeterClass from "@/audio/loudness-meter";
import DragDrop from "@/components/drag-drop";
import { useAudioContext } from "@/contexts/audio";
import useMutable from "@/hooks/use-mutable";

const LoudnessMeter = () => {
  const audioContext = useAudioContext();

  const [fileName, setFileName] = useState("");
  const [loudness, setLoudness] = useState({
    integrated: 0,
    short: 0,
    momentary: 0,
  });
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const loudnessMeter = useMutable(new LoudnessMeterClass());

  loudnessMeter.onProgress((newProgress) => {
    if (newProgress < progress + 0.1) {
      return;
    }
    setProgress(newProgress);
  });

  loudnessMeter.onComplete((loudness) => {
    setIsProcessing(false);
    setLoudness(loudness);
  });

  useEffect(() => {
    return () => loudnessMeter.terminate();
  }, []);

  const handleFileChange = async (files: FileList | null) => {
    if (!files?.[0]?.type.includes("audio/")) {
      return;
    }

    const arrayBuffer = await files[0].arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    setFileName(files[0].name);
    setIsProcessing(true);
    setProgress(0);
    loudnessMeter.load(audioBuffer);
    loudnessMeter.start();

    setAudioBuffer(audioBuffer);
  };

  return (
    <div className="container flex flex-col ">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Loudness Meter</h2>
        <div className="grid w-full max-w-[640px] gap-8">
          {fileName ? (
            <LoudnessDisplay
              integrated={loudness.integrated}
              short={loudness.short}
              momentary={loudness.momentary}
              progress={progress}
              onFileChange={handleFileChange}
              loading={isProcessing}
            />
          ) : (
            <DragDrop onFileChange={handleFileChange} accept="audio/*" />
          )}
          <PlatformPlayer
            audioContext={audioContext}
            fileName={fileName}
            integrated={loudness.integrated}
            audioBuffer={audioBuffer}
            loading={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default LoudnessMeter;
