import { useParams } from "react-router-dom";
import { useGetRecommendationsQuery, useGetTrackQuery } from "@/api/spotify";
import TrackItem from "@/app/tools/similar-song-finder/track-item";
import TrackItemSkeleton from "@/app/tools/similar-song-finder/track-item-skeleton";
import { useState } from "react";

const LIMIT = 29;

const Results = () => {
  const { trackId } = useParams();

  const [playingTrackId, setPlayingTrackId] = useState<string>();

  const handlePlayingTrackIdChange = (playing: string) => {
    setPlayingTrackId(playing);
  };

  const { data: track } = useGetTrackQuery(trackId ?? "", {
    enabled: !!trackId,
  });

  const { data: recommendations } = useGetRecommendationsQuery(
    { seed_tracks: trackId, limit: LIMIT } ?? "",
    {
      enabled: !!trackId,
    },
  );

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-4">
      {track ? (
        <TrackItem
          track={track}
          playingTrackId={playingTrackId}
          onPlayingTrackIdChange={handlePlayingTrackIdChange}
        />
      ) : (
        <TrackItemSkeleton />
      )}
      {recommendations
        ? recommendations.tracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              playingTrackId={playingTrackId}
              onPlayingTrackIdChange={handlePlayingTrackIdChange}
            />
          ))
        : Array(LIMIT)
            .fill(0)
            .map((_, index) => <TrackItemSkeleton key={index} />)}
    </div>
  );
};

export default Results;
