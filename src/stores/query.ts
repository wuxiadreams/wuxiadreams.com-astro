import { QueryClient } from "@tanstack/react-query";
import { atom } from "nanostores";

export const reactQueryClient = atom(
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }),
);
