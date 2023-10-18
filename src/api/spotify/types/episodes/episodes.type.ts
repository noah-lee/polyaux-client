import { Episode } from './episode.type'

export type Episodes = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Episode[]
}
