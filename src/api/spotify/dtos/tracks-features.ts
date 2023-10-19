import { TrackFeatures } from "@/api/spotify/types/tracks/track-features.type";

export type GetTracksFeaturesQueryDto = {
  ids: string;
};

export type GetTracksFeaturesDto = {
  audio_features: TrackFeatures[];
};
