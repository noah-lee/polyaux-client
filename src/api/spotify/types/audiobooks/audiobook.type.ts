import { Author } from '@/api/spotify/types/misc/author.type'
import { Copyright } from '@/api/spotify/types/misc/copyright.type'
import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type'
import { Image } from '@/api/spotify/types/misc/image.types'
import { Narrator } from '@/api/spotify/types/misc/narrator.type'

export type Audiobook = {
  authors: Author[]
  available_markets: string[]
  copyrights: Copyright[]
  description: string
  html_description: string
  edition: string
  explicit: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  languages: string[]
  media_type: string
  name: string
  narrators: Narrator[]
  publisher: string
  type: string
  uri: string
  total_chapters: number
}
