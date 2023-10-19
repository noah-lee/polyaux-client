import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Track } from "@/api/spotify/types/tracks/track.type";
import AudioPlayerButton from "@/app/tools/similar-song-finder/audio-player-button";
import useAudioElement from "@/hooks/use-audio-element";
import useImageColor from "@/hooks/use-image-color";
import { extractSpotifyArtistNames } from "@/utils/spotify";

type Props = {
  track: Track;
  playingTrackId: string | undefined;
  onPlayingTrackIdChange: (playing: string) => void;
};

const TrackItem = ({
  track,
  playingTrackId,
  onPlayingTrackIdChange,
}: Props) => {
  const { id, external_urls, album, name, artists, preview_url } = track;

  const [isPlaying, setIsPlaying] = useState(false);

  const artistNames = extractSpotifyArtistNames(artists);

  const albumArtUrl = album.images[0]?.url;

  const albumColor = useImageColor(albumArtUrl);

  const audioElement = useAudioElement(preview_url ?? undefined);

  const handlePlay = () => {
    if (!audioElement) {
      return;
    }

    audioElement.volume = 0.25;
    audioElement.play();

    setIsPlaying(true);
    onPlayingTrackIdChange(id);
  };

  const handlePause = () => {
    if (!audioElement) {
      return;
    }

    audioElement.pause();

    setIsPlaying(false);
  };

  useEffect(() => {
    if (playingTrackId === id) {
      return;
    }

    handlePause();
  }, [playingTrackId]);

  return (
    <div
      className="flex items-center justify-between gap-8 rounded-md p-4"
      style={{
        backgroundColor:
          albumColor &&
          `rgba(${albumColor[0]}, ${albumColor[1]}, ${albumColor[2]}, 0.3)`,
      }}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <a href={external_urls.spotify} target="_blank">
          <img
            src={album.images[2].url}
            width={52}
            height={52}
            alt="album art"
            className="rounded"
          />
        </a>
        <Link to={`../${id}`} className="flex flex-col gap-1 overflow-hidden">
          <p title={name} className="truncate">
            {name}
          </p>
          <p title={artistNames} className="truncate text-muted-foreground">
            {artistNames}
          </p>
        </Link>
      </div>
      <AudioPlayerButton
        audioElement={audioElement}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
};

export default TrackItem;
