import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "@/api/axios";
import { SearchQueryDto, SearchDto } from "./dtos/search.dto";

export const search = async (
  queryParams: SearchQueryDto
): Promise<SearchDto> => {
  const { data } = await axios.get("/spotify/search", { params: queryParams });
  return data;
};

export const useSearchQuery = (
  queryParams: SearchQueryDto,
  options?: UseQueryOptions<SearchDto>
) => {
  return useQuery({
    queryKey: ["search", queryParams],
    queryFn: () => search(queryParams),
    ...options,
  });
};
