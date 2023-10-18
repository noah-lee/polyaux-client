import { Key } from "@/api/spotify/enums/key.enum";
import { Mode } from "@/api/spotify/enums/mode.enum";

export type TrackFeatures = {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: Key;
  liveness: number;
  loudness: number;
  mode: Mode;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
};
