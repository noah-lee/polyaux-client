import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/index.css";
import { defaultOptions } from "@/api/react-query.ts";
import App from "./app/index.tsx";
import Home from "@/app/home.tsx";
import Tools from "@/app/tools/index.tsx";
import Synthesizer from "@/app/tools/synthesizer";
import Metronome from "@/app/tools/metronome/index.tsx";
import Tuner from "@/app/tools/tuner/index.tsx";
import BpmTapper from "@/app/tools/bpm-tapper/index.tsx";
import LoudnessMeter from "@/app/tools/loudness-meter/index.tsx";
import SimilarSongFinder from "@/app/tools/similar-song-finder/index.tsx";
import SimilarSongResults from "@/app/tools/similar-song-finder/similar-song-results.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { AudioContextProvider } from "@/contexts/audio.tsx";
import { ThemeProvider } from "@/contexts/theme.tsx";
import { AdsrContextProvider } from "@/contexts/adsr.tsx";
import { ScrollContextProvider } from "@/contexts/scroll.tsx";

const queryClient = new QueryClient(defaultOptions);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ScrollContextProvider>
            <TooltipProvider delayDuration={200}>
              <ScrollRestoration />
              <AudioContextProvider>
                <App />
              </AudioContextProvider>
            </TooltipProvider>
          </ScrollContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    children: [
      { index: true, element: <Home /> },
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
        path: "similar-song-finder",
        element: <SimilarSongFinder />,
        children: [
          {
            path: ":trackId",
            element: <SimilarSongResults />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
