import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type'

export type SimplifiedArtist = {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}
