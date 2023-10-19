import SearchBar from "@/app/tools/similar-song-finder/search-bar";
import { Outlet } from "react-router-dom";

const SimilarSongFinder = () => {
  return (
    <div className="container">
      <div className="flex flex-col items-center gap-16 py-[64px]">
        <h2 className="text-2xl font-semibold">Similar Song Finder</h2>
        <SearchBar />
        <Outlet />
      </div>
    </div>
  );
};

export default SimilarSongFinder;
