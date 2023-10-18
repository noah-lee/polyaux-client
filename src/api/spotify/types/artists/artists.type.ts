import { Artist } from './artist.type'

export type Artists = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Artist[]
}
