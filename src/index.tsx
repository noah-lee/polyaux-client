import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/index.css";
import App from "./app/index.tsx";
import { AudioContextProvider } from "@/contexts/audio.tsx";
import { ThemeProvider } from "@/contexts/theme.tsx";
import { AdsrContextProvider } from "@/contexts/adsr.tsx";
import Synthesizer from "@/app/tools/synthesizer";
import Tools from "@/app/tools/index.tsx";
import Metronome from "@/app/tools/metronome/index.tsx";
import Tuner from "@/app/tools/tuner/index.tsx";
import BpmTapper from "@/app/tools/bpm-tapper/index.tsx";
import LoudnessMeter from "@/app/tools/loudness-meter/index.tsx";
import SimilarSongsFinder from "@/app/tools/similar-songs-finder/index.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import Recommendations from "@/app/tools/similar-songs-finder/recommendations.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider delayDuration={200}>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: "tools",
        element: (
          <AudioContextProvider>
            <Tools />
          </AudioContextProvider>
        ),
        children: [
          {
            path: "synthesizer",
            element: (
              <AdsrContextProvider>
                <Synthesizer />
              </AdsrContextProvider>
            ),
          },
          {
            path: "metronome",
            element: <Metronome />,
          },
          {
            path: "tuner",
            element: <Tuner />,
          },
          {
            path: "bpm-tapper",
            element: <BpmTapper />,
          },
          {
            path: "loudness-meter",
            element: <LoudnessMeter />,
          },
          {
            path: "similar-songs-finder",
            element: <SimilarSongsFinder />,
            children: [
              {
                path: ":id",
                element: <Recommendations />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
