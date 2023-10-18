import { ExternalUrls } from '@/api/spotify/types/misc/external-urls.type'
import { Image } from '@/api/spotify/types/misc/image.types' 
import { Restrictions } from '@/api/spotify/types/misc/restrictions.type'
import { ResumePoint } from '@/api/spotify/types/misc/resume-point.type'

export type Episode = {
  audio_preview_url: string
  description: string
  html_description: string
  duration_ms: number
  explicit: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  is_externally_hosted: boolean
  is_playable: boolean
  language: string
  languages: string[]
  name: string
  release_date: string
  release_date_precision: string
  resume_point: ResumePoint
  type: string
  uri: string
  restrictions: Restrictions
}
