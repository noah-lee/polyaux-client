import { Show } from './show.type'

export type Shows = {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: Show[]
}
