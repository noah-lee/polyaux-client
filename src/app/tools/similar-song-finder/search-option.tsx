import { Link } from "react-router-dom";
import { Track } from "@/api/spotify/types/tracks/track.type";

type Props = {
  track: Track;
  onClick?: () => void;
};

const SearchOption = ({ track, onClick }: Props) => {
  const { id, album, artists, name } = track;

  const artistName = artists.map((artist) => artist.name).join(", ");

  return (
    <Link to={id} onClick={onClick}>
      <div
        className="flex items-center gap-2 rounded-md p-2 transition-colors
        hover:bg-accent hover:text-accent-foreground
        focus:bg-accent focus:text-accent-foreground"
      >
        <img src={album.images[0].url} width={48} height={48} alt="album art" />
        <div className="overflow-hidden">
          <h4 title={name} className="truncate">
            {name}
          </h4>
          <h5 title={artistName} className="truncate text-muted-foreground">
            {artistName}
          </h5>
        </div>
      </div>
    </Link>
  );
};

export default SearchOption;
