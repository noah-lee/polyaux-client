import { Audiobook } from '@/api/spotify/types/audiobooks/audiobook.type'

export type Audiobooks = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Audiobook[]
}
