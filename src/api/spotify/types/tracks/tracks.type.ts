import { Track } from "./track.type"

export type Tracks = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Track[]
}
