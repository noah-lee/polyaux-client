import { useParams } from "react-router-dom";
import { useGetRecommendationsQuery, useGetTrackQuery } from "@/api/spotify";
import TrackItem from "@/app/tools/similar-song-finder/track-item";
import TrackItemSkeleton from "@/app/tools/similar-song-finder/track-item-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUpIcon, RefreshCcwIcon } from "lucide-react";
import { useScrollContext } from "@/contexts/scroll";
import { Separator } from "@/components/ui/separator";

const LIMIT = 29;

const SimilarSongResults = () => {
  const { trackId } = useParams();

  const { onScrollTop } = useScrollContext();

  const [playingTrackId, setPlayingTrackId] = useState<string>();

  const handlePlayingTrackIdChange = (playing: string) => {
    setPlayingTrackId(playing);
  };

  const { data: track } = useGetTrackQuery(trackId ?? "", {
    enabled: !!trackId,
  });

  const { data: recommendations, refetch } = useGetRecommendationsQuery(
    { seed_tracks: trackId, limit: LIMIT } ?? "",
    {
      enabled: !!trackId,
    },
  );

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-4">
      {track ? (
        <TrackItem
          track={track}
          playingTrackId={playingTrackId}
          onPlayingTrackIdChange={handlePlayingTrackIdChange}
        />
      ) : (
        <TrackItemSkeleton />
      )}
      <div className="h-8" />
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
      {track && recommendations && (
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={onScrollTop}>
            <ArrowBigUpIcon />
          </Button>
          <Button
            onClick={() => {
              onScrollTop();
              refetch();
            }}
          >
            <RefreshCcwIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimilarSongResults;
