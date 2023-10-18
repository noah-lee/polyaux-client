import { Album } from './album.type'

export type Albums = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Album[]
}
