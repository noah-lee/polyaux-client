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
  const animationFrameRef = useRef(0);

  const { mediaStream, audioSource } = useAudioUserMedia(audioContext);

  const analyser = useMutable(new AnalyserNode(audioContext));
  analyser.fftSize = 4096;
  analyser.minDecibels = -80;

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
    } else {
      setNotes((prevNotes) => ["", ...prevNotes].slice(0, WINDOW_SIZE));
      setCents((prevCents) => [undefined, ...prevCents].slice(0, WINDOW_SIZE));
    }

    animationFrameRef.current = requestAnimationFrame(updateNote);
    return;
  }, [audioContext, analyser]);

  useEffect(() => {
    if (!mediaStream || !audioSource) {
      return;
    }

    audioContext.resume();
    audioSource.connect(analyser);
    updateNote();

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [mediaStream, audioSource, audioContext, analyser, updateNote]);

  const mostFrequentNote = useMemo(() => getMostOccurrence(notes), [notes]);

  const averageCents = useMemo(
    () => getAverage(cents.filter(Boolean) as number[]),
    [cents],
  );

  const position = useMemo(() => {
    if (!mostFrequentNote || !averageCents) {
      return 0.5;
    }

    const actualPosition = percentage(averageCents, -50, 50);

    if (actualPosition > 0.475 && actualPosition < 0.525) {
      return 0.5;
    }

    return actualPosition;
  }, [mostFrequentNote, averageCents]);

  const hue = useMemo(() => {
    if (!mostFrequentNote || !averageCents) {
      return;
    }

    return Math.max(1 - percentage(Math.abs(averageCents), 0, 30), 0) * 100;
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
          <p
            className={cn("pb-4 text-5xl font-bold")}
            style={{
              color: hue === undefined ? "inherit" : `hsl(${hue}, 40%, 60%)`,
            }}
          >
            {mostFrequentNote || "."}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Tuner;
