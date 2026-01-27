import type { PortableTextBlock } from 'sanity'

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

export interface SanityProject {
  _id: string
  _type: 'project'
  title: string
  slug: {
    current: string
  }
  shortDescription?: string
  description?: PortableTextBlock[]
  featuredImage?: SanityImage
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'UPCOMING'
  isFeatured?: boolean
  startDate?: string
  endDate?: string
  researchAreas?: string[]
  methodology?: PortableTextBlock[]
  outcomes?: PortableTextBlock[]
  website?: string
  githubRepo?: string
  members?: Array<{
    _ref: string
    _type: 'reference'
  }>
  collaborators?: Array<{
    name: string
    institution?: string
    website?: string
  }>
  funding?: Array<{
    agency: string
    grantNumber?: string
    amount?: number
    currency?: string
  }>
  gallery?: SanityImage[]
  videos?: Array<{
    title: string
    url: string
    description?: string
  }>
}

export interface SanityNews {
  _id: string
  _type: 'news'
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  body?: PortableTextBlock[]
  featuredImage?: SanityImage
  newsType: 'NEWS' | 'AWARD' | 'PUBLICATION' | 'GRANT' | 'EVENT' | 'MEDIA' | 'TEAM' | 'OTHER'
  publishedAt: string
  isFeatured?: boolean
  isPublished?: boolean
  relatedMembers?: Array<{
    _ref: string
    _type: 'reference'
  }>
  relatedProjects?: Array<{
    _ref: string
    _type: 'reference'
  }>
  relatedPublications?: Array<{
    _ref: string
    _type: 'reference'
  }>
  tags?: string[]
  externalLink?: string
}
