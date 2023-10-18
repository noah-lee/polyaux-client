import SearchBar from "@/app/tools/similar-songs-finder/search-bar";
import { Outlet } from "react-router-dom";

const SimilarSongsFinder = () => {
  return (
    <div className="container">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Similar Songs Finder</h2>
        <SearchBar path="/tools/similar-songs-finder" />
        <Outlet />
      </div>
    </div>
  );
};

export default SimilarSongsFinder;
