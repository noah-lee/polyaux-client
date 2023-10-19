import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fromDecibel } from "@/utils/audio";
import { Loader2Icon } from "lucide-react";
import AudioPlayer from "@/components/audio-player";

const PLATFORMS = [
  {
    name: "Original",
    target: 0,
  },
  {
    name: "Spotify",
    target: -14,
  },
  {
    name: "Apple",
    target: -16,
  },
  {
    name: "YouTube",
    target: -14,
  },
  {
    name: "Amazon",
    target: -14,
  },
  {
    name: "SoundCloud",
    target: -14,
  },
  {
    name: "BandCamp",
    target: 0,
  },
  {
    name: "Tidal",
    target: -14,
  },
  {
    name: "Pandora",
    target: -14,
  },
  {
    name: "Deezer",
    target: -15,
  },
  {
    name: "Qobuz",
    target: -18,
  },
];

type Props = {
  audioContext: AudioContext;
  fileName: string;
  integrated: number;
  audioBuffer: AudioBuffer | undefined;
  loading?: boolean;
};

const PlatformPlayer = ({
  audioContext,
  fileName,
  integrated,
  audioBuffer,
  loading,
}: Props) => {
  const [platform, setPlatform] = useState(PLATFORMS[1]);

  const handlePlatformChange = (name: string) => {
    const platform = PLATFORMS.find((platform) => platform.name === name);

    if (!platform) {
      return;
    }

    setPlatform(platform);
  };

  const volume = useMemo(() => {
    return fromDecibel(platform.target - integrated);
  }, [integrated, platform]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Listen on</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <Select value={platform.name} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Streaming Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PLATFORMS.map(({ name, target }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap justify-evenly gap-8 text-xl">
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Target (LUFS)</p>
            <p>{(platform.target || integrated).toFixed(1)}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Penalty (dB)</p>
            {loading ? (
              <Loader2Icon width={28} height={28} className="animate-spin" />
            ) : (
              <p>
                {(platform.target ? platform.target - integrated : 0).toFixed(
                  1,
                )}
              </p>
            )}
          </div>
        </div>
        <AudioPlayer
          audioContext={audioContext}
          audioBuffer={audioBuffer}
          volume={volume}
          disabled={loading}
        />
        <p>{fileName}</p>
      </CardContent>
    </Card>
  );
};

export default PlatformPlayer;
