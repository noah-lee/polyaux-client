import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type'
import { Image } from '@/api/spotify/types/misc/image.types'
import { Owner } from '@/api/spotify/types/misc/owner.type'
import { PlaylistTracks } from '@/api/spotify/types/playlists/playlist-tracks.type'

export type Plaulist = {
  collaborative: boolean
  description: string
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  public: boolean
  snapshot_id: string
  tracks: PlaylistTracks
  type: string
  uri: string
}
