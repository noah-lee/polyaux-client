import { Skeleton } from "@/components/ui/skeleton";

const SearchOptionSkeleton = () => {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-12 w-12" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default SearchOptionSkeleton;
