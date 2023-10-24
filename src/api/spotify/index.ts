import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "@/api/axios";
import { SearchDto, SearchQueryDto } from "@/api/spotify/dtos/search.dto";
import { GetTrackDto } from "@/api/spotify/dtos/tracks.dto";
import {
  GetRecommendationsDto,
  GetRecommendationsQueryDto,
} from "@/api/spotify/dtos/recommendations.dto";
import {
  GetTracksFeaturesDto,
  GetTracksFeaturesQueryDto,
} from "@/api/spotify/dtos/tracks-features";

export const search = async (queryParams: SearchQueryDto) => {
  console.log(axios.defaults.baseURL);
  const { data } = await axios.get("/spotify/search", { params: queryParams });
  return data;
};

export const useSearchQuery = (
  queryParams: SearchQueryDto,
  options?: UseQueryOptions<SearchDto>,
) => {
  return useQuery({
    queryKey: ["search", queryParams],
    queryFn: () => search(queryParams),
    ...options,
  });
};

export const getTrack = async (id: string) => {
  const { data } = await axios.get(`/spotify/tracks/${id}`);
  return data;
};

export const useGetTrackQuery = (
  id: string,
  options?: UseQueryOptions<GetTrackDto>,
) => {
  return useQuery({
    queryKey: ["track", id],
    queryFn: () => getTrack(id),
    ...options,
  });
};

export const getRecommendations = async (
  queryParams: GetRecommendationsQueryDto,
) => {
  const { data } = await axios.get("/spotify/recommendations", {
    params: queryParams,
  });
  return data;
};

export const useGetRecommendationsQuery = (
  query: GetRecommendationsQueryDto,
  options?: UseQueryOptions<GetRecommendationsDto>,
) => {
  return useQuery({
    queryKey: ["recommendations", query],
    queryFn: () => getRecommendations(query),
    ...options,
  });
};

export const getTracksFeatures = async (query: GetTracksFeaturesQueryDto) => {
  const { data } = await axios.get(`/spotify/tracks/features`, {
    params: query,
  });
  return data;
};

export const useGetTracksFeatures = (
  query: GetTracksFeaturesQueryDto,
  options?: UseQueryOptions<GetTracksFeaturesDto>,
) => {
  return useQuery({
    queryKey: ["features", query],
    queryFn: () => getTracksFeatures(query),
    ...options,
  });
};
