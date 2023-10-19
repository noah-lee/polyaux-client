import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useAudioContext } from "@/contexts/audio";
import useElementSize from "@/hooks/use-element-size";
import useMutable from "@/hooks/use-mutable";
import useAudioUserMedia from "@/hooks/use-user-media";
import { getAverage, getMostOccurrence } from "@/utils/array";
import { autocorrelation, maxCorrelationIndex, percentage } from "@/utils/math";
import {
  getCentsOffset,
  getClosestNote,
  getClosestNoteFrequency,
} from "@/utils/music";
import TunerDisplay from "@/app/tools/tuner/display";
import { cn } from "@/utils/styles";

const WINDOW_SIZE = 25;

const Tuner = () => {
  const audioContext = useAudioContext();

  const [notes, setNotes] = useState<string[]>([]);
  const [cents, setCents] = useState<(number | undefined)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { mediaStream, audioSource } = useAudioUserMedia(audioContext);

  const analyser = useMutable(new AnalyserNode(audioContext));
  analyser.fftSize = 4096;

  const updateNote = useCallback(() => {
    const dataArray = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(dataArray);

    const correlations = autocorrelation(dataArray);
    const maxCorrelation = maxCorrelationIndex(correlations);

    if (maxCorrelation.index > 0) {
      const dominantFrequency = audioContext.sampleRate / maxCorrelation.index;
      const closestNote = getClosestNote(dominantFrequency);
      const closestNoteFrequency = getClosestNoteFrequency(dominantFrequency);
      const centsOffset = getCentsOffset(
        dominantFrequency,
        closestNoteFrequency,
      );

      setNotes((prevNotes) =>
        [closestNote, ...prevNotes].slice(0, WINDOW_SIZE),
      );
      setCents((prevCents) =>
        [centsOffset, ...prevCents].slice(0, WINDOW_SIZE),
      );

      return requestAnimationFrame(updateNote);
    }

    setNotes((prevNotes) => ["", ...prevNotes].slice(0, WINDOW_SIZE));
    setCents((prevCents) => [undefined, ...prevCents].slice(0, WINDOW_SIZE));

    return requestAnimationFrame(updateNote);
  }, [audioContext, analyser]);

  useEffect(() => {
    if (!mediaStream || !audioSource) {
      return;
    }

    audioContext.resume();
    audioSource.connect(analyser);
    updateNote();
  }, [mediaStream, audioSource, audioContext, analyser, updateNote]);

  const mostFrequentNote = useMemo(() => getMostOccurrence(notes), [notes]);

  const averageCents = useMemo(
    () => getAverage(cents.filter(Boolean) as number[]),
    [cents],
  );

  const position = useMemo(
    () =>
      mostFrequentNote && averageCents
        ? percentage(averageCents, -50, 50)
        : 0.5,
    [mostFrequentNote, averageCents],
  );

  const color = useMemo(() => {
    if (!mostFrequentNote || !averageCents) {
      return "";
    }

    if (Math.abs(averageCents) > 25) {
      return "text-destructive";
    }

    if (Math.abs(averageCents) > 5) {
      return "text-warning";
    }

    return "text-success";
  }, [mostFrequentNote, averageCents]);

  const { width: containerWidth } = useElementSize(containerRef);

  return (
    <div className="container flex flex-col">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Tuner</h2>
        <Card
          ref={containerRef}
          className="flex w-full max-w-[480px] flex-col items-center p-4"
        >
          {containerWidth && (
            <TunerDisplay
              width={containerWidth}
              height={96}
              percentage={position}
            />
          )}
          <p className={cn("pb-4 text-5xl font-bold", color)}>
            {mostFrequentNote || "."}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Tuner;
