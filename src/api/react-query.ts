import { QueryClientConfig } from "@tanstack/react-query";

export const defaultOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
};
