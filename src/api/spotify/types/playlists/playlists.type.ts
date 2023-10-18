import { Plaulist } from "./playlist.type"

export type Playlists = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Plaulist[]
}