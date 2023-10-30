import { useState, ChangeEvent, useRef } from "react";
import { useSearchQuery } from "@/api/spotify";
import SearchOption from "@/app/tools/similar-song-finder/search-option";
import SearchOptionSkeleton from "@/app/tools/similar-song-finder/search-option-skeleton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useClickOutside from "@/hooks/use-click-outside";
import useDebounce from "@/hooks/use-debounce";
import { useScrollContext } from "@/contexts/scroll";

const LIMIT = 5;

const SearchBar = () => {
  const { onScrollTop } = useScrollContext();

  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [searchInput, setSearchQuery] = useState("");

  const { data: result, isLoading } = useSearchQuery(
    {
      q: searchInput,
      type: "track",
      limit: LIMIT,
    },
    { enabled: !!searchInput },
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
  };

  useDebounce(() => setSearchQuery(input), 500, [input]);

  const handleClearInput = () => {
    setInput("");
    setSearchQuery("");
  };

  const handleClickOutside = () => {
    if (!searchInput) return;
    handleClearInput();
  };

  const handleSelect = () => {
    handleClearInput();
    onScrollTop();
  };

  useClickOutside(inputRef, handleClickOutside);

  return (
    <div className="sticky top-[72px] z-10 w-full max-w-[480px]">
      <div ref={inputRef} className="relative">
        <Input
          placeholder="Search"
          value={input}
          onChange={handleInputChange}
          className="border-2 border-border"
        />
        {searchInput && (
          <Card className="absolute z-10 mt-2 w-full overflow-y-auto p-4">
            <ul className="flex flex-col gap-4">
              {isLoading &&
                Array(LIMIT)
                  .fill(0)
                  .map((_, index) => (
                    <li key={index}>
                      <SearchOptionSkeleton />
                    </li>
                  ))}
              {!isLoading &&
                result?.tracks.items.map((track) => (
                  <li key={track.id}>
                    <SearchOption track={track} onClick={handleSelect} />
                  </li>
                ))}

              {!isLoading && !result?.tracks.total && <p>No results found</p>}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
