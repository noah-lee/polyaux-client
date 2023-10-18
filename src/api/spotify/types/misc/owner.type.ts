import { ExternalUrls } from "./external-urls.type"
import { Followers } from "./followers.type"

export type Owner = {
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  type: string
  uri: string
  display_name: string | null

}