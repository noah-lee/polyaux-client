import { Copyright } from "@/api/spotify/types/misc/copyright.type" 
import { ExternalIds } from "@/api/spotify/types/misc/external-ids.type" 
import { ExternalUrls } from "@/api/spotify/types/misc/external-urls.type" 
import { Image } from "@/api/spotify/types/misc/image.types" 
import { Restrictions } from "@/api/spotify/types/misc/restrictions.type"
import { SimplifiedArtist } from "@/api/spotify/types/artists/simplified-artist.type" 

export type Album = {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: Restrictions
  type: string
  uri: string
  copyrights: Copyright[]
  external_ids: ExternalIds
  genres: string[]
  label: string
  popularity: number
  album_group: string
  artists: SimplifiedArtist[]
}
