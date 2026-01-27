import { client } from './client'
import type { SanityProject, SanityNews } from './types'

const PROJECTS_QUERY = `*[_type == "project"] | order(startDate desc) {
  _id,
  _type,
  title,
  slug,
  shortDescription,
  description,
  featuredImage {
    asset,
    alt
  },
  status,
  isFeatured,
  startDate,
  endDate,
  researchAreas,
  methodology,
  outcomes,
  website,
  githubRepo,
  members[]-> {
    _id,
    _type,
    name
  },
  collaborators,
  funding,
  gallery[] {
    asset,
    alt,
    caption
  },
  videos
}`

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  shortDescription,
  description,
  featuredImage {
    asset,
    alt
  },
  status,
  isFeatured,
  startDate,
  endDate,
  researchAreas,
  methodology,
  outcomes,
  website,
  githubRepo,
  members[]-> {
    _id,
    _type,
    name,
    slug
  },
  collaborators,
  funding,
  gallery[] {
    asset,
    alt,
    caption
  },
  videos
}`

export async function getProjects(): Promise<SanityProject[]> {
  return client.fetch<SanityProject[]>(PROJECTS_QUERY)
}

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  return client.fetch<SanityProject | null>(PROJECT_BY_SLUG_QUERY, { slug })
}

const NEWS_QUERY = `*[_type == "news" && isPublished == true] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  excerpt,
  body,
  featuredImage {
    asset,
    alt,
    caption
  },
  newsType,
  publishedAt,
  isFeatured,
  isPublished,
  relatedMembers[]-> {
    _id,
    _type,
    name,
    slug
  },
  relatedProjects[]-> {
    _id,
    _type,
    title,
    slug
  },
  relatedPublications[]-> {
    _id,
    _type,
    title
  },
  tags,
  externalLink
}`

const FEATURED_NEWS_QUERY = `*[_type == "news" && isPublished == true && isFeatured == true] | order(publishedAt desc) [0...6] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  featuredImage {
    asset,
    alt,
    caption
  },
  newsType,
  publishedAt,
  isFeatured
}`

const NEWS_BY_SLUG_QUERY = `*[_type == "news" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  body,
  featuredImage {
    asset,
    alt,
    caption
  },
  newsType,
  publishedAt,
  isFeatured,
  relatedMembers[]-> {
    _id,
    _type,
    name,
    slug
  },
  relatedProjects[]-> {
    _id,
    _type,
    title,
    slug
  },
  relatedPublications[]-> {
    _id,
    _type,
    title
  },
  tags,
  externalLink
}`

export async function getNews(): Promise<SanityNews[]> {
  return client.fetch<SanityNews[]>(NEWS_QUERY)
}

export async function getFeaturedNews(): Promise<SanityNews[]> {
  return client.fetch<SanityNews[]>(FEATURED_NEWS_QUERY)
}

export async function getNewsBySlug(slug: string): Promise<SanityNews | null> {
  return client.fetch<SanityNews | null>(NEWS_BY_SLUG_QUERY, { slug })
}
