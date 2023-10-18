import { Copyright } from "@/api/spotify/types/misc/copyright.type" 
import { ExternalUrls } from "@/api/spotify/types/misc/external-urls.type" 
import { Image } from "@/api/spotify/types/misc/image.types" 

export type Show = {
  available_markets: string[]
  copyrights: Copyright
  description: string
  html_description: string
  explicit: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  is_externally_hosted: boolean
  languages: string[]
  media_type: string
  name: string
  publisher: string
  type: string
  uri: string
  total_episodes: number
}
