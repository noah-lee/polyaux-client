import { Album } from '@/api/spotify/types/albums/album.type' 
import { Artist } from '@/api/spotify/types/artists/artist.type' 
import { ExternalIds } from '@/api/spotify/types/misc/external-ids.type' 
import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type' 
import { LinkedFrom } from '@/api/spotify/types/misc/linked-from.type' 
import { Restrictions } from '@/api/spotify/types/misc/restrictions.type' 

export type Track = {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_playable: boolean
  linked_from: LinkedFrom
  restrictions: Restrictions
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: string
  uri: string
  is_local: boolean
}
