import { Artist } from "@/api/spotify/types/artists/artist.type";
import { SimplifiedArtist } from "@/api/spotify/types/artists/simplified-artist.type";
import { Key } from "@/api/spotify/enums/key.enum"; 
import { Mode } from "@/api/spotify/enums/mode.enum"; 

export const extractSpotifyArtistNames = (
  artists: Artist[] | SimplifiedArtist[],
) => artists.map((artist) => artist.name).join(", ");

export const mapSpotifyKey = {
  [Key.C]: "C",
  [Key.Db]: "Db",
  [Key.D]: "D",
  [Key.Eb]: "Eb",
  [Key.E]: "E",
  [Key.F]: "F",
  [Key.Gb]: "Gb",
  [Key.G]: "G",
  [Key.A]: "A",
  [Key.Ab]: "Ab",
  [Key.Bb]: "Bb",
  [Key.B]: "B",
};

export const mapSpotifyMode = {
  [Mode.MINOR]: "min",
  [Mode.MAJOR]: "maj",
};
