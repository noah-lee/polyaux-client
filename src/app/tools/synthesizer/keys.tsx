import { useCallback, useState } from "react";
import { useAdsrContext } from "@/contexts/adsr";
import MonoOscillator from "@/audio/mono-oscillator";
import PolyOscillator from "@/audio/poly-oscillator";
import useKeyDown from "@/hooks/use-key-down";
import useKeyUp from "@/hooks/use-key-up";
import { cn } from "@/utils/styles";

const keys = [
  {
    key: "a",
    frequency: 261.63,
    position: 0,
  },
  {
    key: "w",
    frequency: 277.18,
    position: 0.5,
  },
  {
    key: "s",
    frequency: 293.66,
    position: 1,
  },
  {
    key: "e",
    frequency: 311.13,
    position: 1.5,
  },
  {
    key: "d",
    frequency: 329.63,
    position: 2,
  },
  {
    key: "f",
    frequency: 349.23,
    position: 3,
  },
  {
    key: "t",
    frequency: 369.99,
    position: 3.5,
  },
  {
    key: "g",
    frequency: 392,
    position: 4,
  },
  {
    key: "y",
    frequency: 415.3,
    position: 4.5,
  },
  {
    key: "h",
    frequency: 440,
    position: 5,
  },
  {
    key: "u",
    frequency: 466.16,
    position: 5.5,
  },
  {
    key: "j",
    frequency: 493.88,
    position: 6,
  },
  {
    key: "k",
    frequency: 523.25,
    position: 7,
  },
  {
    key: "o",
    frequency: 554.37,
    position: 7.5,
  },
  {
    key: "l",
    frequency: 587.33,
    position: 8,
  },
  {
    key: "p",
    frequency: 622.25,
    position: 8.5,
  },
  {
    key: ";",
    frequency: 659.25,
    position: 9,
  },
  {
    key: "'",
    frequency: 698.46,
    position: 10,
  },
];

const KEY_WIDTH = 64;
const KEYBOARD_WIDTH = (keys[keys.length - 1].position + 1) * KEY_WIDTH;

type Props = {
  oscillators: PolyOscillator[];
};

const Keys = ({ oscillators }: Props) => {
  const {
    adsr: { attack, decay, sustain, release },
  } = useAdsrContext();

  const [isPointerDown, setIsPointerDown] = useState(false);

  const handleStart = useCallback(
    (frequency: number) =>
      oscillators.forEach((oscillator) =>
        oscillator.start(frequency, attack, decay, sustain),
      ),
    [oscillators, attack, decay, sustain],
  );

  const handleStop = useCallback(
    (frequency: number) =>
      oscillators.forEach((oscillator) => oscillator.stop(frequency, release)),
    [oscillators, release],
  );

  const handlePointerDown = (frequency: number) => {
    handleStart(frequency);
    setIsPointerDown(true);
  };

  const handlePointerUp = (frequency: number) => {
    handleStart(frequency);
    setIsPointerDown(false);
  };

  useKeyDown((event) => {
    if (event.repeat) {
      return;
    }

    const frequency = keys.find(({ key }) => key === event.key)?.frequency;

    if (!frequency) {
      return;
    }

    handleStart(frequency);
  });

  useKeyUp((event) => {
    const frequency = keys.find(({ key }) => key === event.key)?.frequency;

    if (!frequency) {
      return;
    }

    handleStop(frequency);
  });

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="relative h-[176px]" style={{ width: KEYBOARD_WIDTH }}>
        {keys.map(({ key, frequency, position }) => (
          <button
            key={key}
            onPointerDown={() => handlePointerDown(frequency)}
            onPointerUp={() => handlePointerUp(frequency)}
            onPointerEnter={() => isPointerDown && handleStart(frequency)}
            onPointerOut={() => handleStop(frequency)}
            className={cn(
              "absolute flex items-end justify-start rounded-lg border p-2",
              position % 1
                ? "z-10 h-[112px] translate-x-1/4 bg-primary text-primary-foreground"
                : "500 h-[176px] bg-card",
            )}
            style={{
              left: KEY_WIDTH * position,
              width: position % 1 ? KEY_WIDTH / 1.5 : KEY_WIDTH,
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Keys;
