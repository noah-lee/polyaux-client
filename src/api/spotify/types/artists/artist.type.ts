import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type'
import { Followers } from '@/api/spotify/types/misc/followers.type'
import { Image } from '@/api/spotify/types/misc/image.types'

export type Artist = {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  Images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}
