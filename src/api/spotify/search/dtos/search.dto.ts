import { Tracks } from "@/api/spotify/types/tracks/tracks.type";
import { Artists } from "@/api/spotify/types/artists/artists.type";
import { Albums } from "@/api/spotify/types/albums/albums.type";
import { Playlists } from "@/api/spotify/types/playlists/playlists.type";
import { Shows } from "@/api/spotify/types/shows/shows.type";
import { Episodes } from "@/api/spotify/types/episodes/episodes.type";
import { Audiobooks } from "@/api/spotify/types/audiobooks/audiobooks.type";

export type SearchQueryDto = {
  q: string;
  type:
    | "album"
    | "artist"
    | "playlist"
    | "track"
    | "show"
    | "episode"
    | "audiobook";
  limit?: number;
  offset?: number;
  include_external?: "audio";
};

export type SearchDto = {
  tracks: Tracks;
  artists: Artists;
  albums: Albums;
  playlists: Playlists;
  shows: Shows;
  episodes: Episodes;
  audiobooks: Audiobooks;
};
