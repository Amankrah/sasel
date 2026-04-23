import { client } from './client'
import type {
  SanityProject,
  SanityNews,
  SanityTechnology,
  SanityMember,
  SanityPublication,
  SanityGrant,
  SanityAward,
  SanityCollaboration,
  SanityPartnership,
  SanityPartner,
} from './types'

const PROJECT_FIELDS = `
  _id,
  _type,
  title,
  slug,
  shortDescription,
  description,
  featuredImage { asset, alt },
  status,
  isFeatured,
  featuredOrder,
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
  relatedTechnologies[]-> {
    _id,
    _type,
    title,
    slug,
    tagline,
    accentColor,
    status
  },
  relatedPublications[]-> {
    _id,
    _type,
    title,
    slug,
    year,
    journal,
    conference,
    doi,
    url
  },
  collaborators,
  funding,
  gallery[] { asset, alt, caption },
  videos
`

const PROJECTS_QUERY = `*[_type == "project"] | order(startDate desc) { ${PROJECT_FIELDS} }`

const FEATURED_PROJECTS_QUERY = `*[_type == "project" && isFeatured == true] | order(featuredOrder asc, startDate desc) [0...3] { ${PROJECT_FIELDS} }`

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`

export async function getProjects(): Promise<SanityProject[]> {
  return client.fetch<SanityProject[]>(PROJECTS_QUERY)
}

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  return client.fetch<SanityProject[]>(FEATURED_PROJECTS_QUERY)
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

const TECHNOLOGY_FIELDS = `
  _id,
  _type,
  title,
  slug,
  tagline,
  description,
  featuredImage {
    asset,
    alt
  },
  status,
  isFeatured,
  featuredOrder,
  accentColor,
  launchDate,
  lastMajorRelease,
  categories,
  techStack,
  keyFeatures,
  targetUsers,
  methodology,
  website,
  githubRepo,
  documentationUrl,
  demoUrl,
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
  videos,
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
  }
`

const TECHNOLOGIES_QUERY = `*[_type == "technology"] | order(featuredOrder asc, title asc) {
  ${TECHNOLOGY_FIELDS}
}`

const FEATURED_TECHNOLOGIES_QUERY = `*[_type == "technology" && isFeatured == true] | order(featuredOrder asc) {
  ${TECHNOLOGY_FIELDS}
}`

const TECHNOLOGY_BY_SLUG_QUERY = `*[_type == "technology" && slug.current == $slug][0] {
  ${TECHNOLOGY_FIELDS}
}`

export async function getTechnologies(): Promise<SanityTechnology[]> {
  return client.fetch<SanityTechnology[]>(TECHNOLOGIES_QUERY)
}

export async function getFeaturedTechnologies(): Promise<SanityTechnology[]> {
  return client.fetch<SanityTechnology[]>(FEATURED_TECHNOLOGIES_QUERY)
}

export async function getTechnologyBySlug(slug: string): Promise<SanityTechnology | null> {
  return client.fetch<SanityTechnology | null>(TECHNOLOGY_BY_SLUG_QUERY, { slug })
}

const MEMBER_FIELDS = `
  _id,
  _type,
  name,
  slug,
  image { asset, alt },
  memberType,
  position,
  bio,
  email,
  googleScholarId,
  website,
  joinedDate,
  leftDate,
  isActive,
  order,
  socialLinks
`

export async function getMembers(): Promise<SanityMember[]> {
  return client.fetch<SanityMember[]>(
    `*[_type == "member"] | order(order asc, name asc) { ${MEMBER_FIELDS} }`,
  )
}

export async function getMemberBySlug(slug: string): Promise<SanityMember | null> {
  return client.fetch<SanityMember | null>(
    `*[_type == "member" && slug.current == $slug][0] { ${MEMBER_FIELDS} }`,
    { slug },
  )
}

const PUBLICATION_FIELDS = `
  _id,
  _type,
  title,
  slug,
  publicationType,
  abstract,
  featuredImage { asset, alt },
  year,
  month,
  journal,
  conference,
  publisher,
  volume,
  issue,
  pages,
  doi,
  url,
  citation,
  externalId,
  authors[]-> {
    _id,
    _type,
    name,
    slug,
    joinedDate,
    memberType
  },
  externalAuthors,
  authorOrder,
  relatedProjects[]-> { _id, _type, title, slug },
  relatedTechnologies[]-> { _id, _type, title, slug },
  tags
`

export async function getPublications(): Promise<SanityPublication[]> {
  return client.fetch<SanityPublication[]>(
    `*[_type == "publication"] | order(year desc, month desc) { ${PUBLICATION_FIELDS} }`,
  )
}

export async function getPublicationBySlug(slug: string): Promise<SanityPublication | null> {
  return client.fetch<SanityPublication | null>(
    `*[_type == "publication" && slug.current == $slug][0] { ${PUBLICATION_FIELDS} }`,
    { slug },
  )
}

export async function getGrants(): Promise<SanityGrant[]> {
  return client.fetch<SanityGrant[]>(
    `*[_type == "grant"] | order(startDate desc) {
      _id, _type, title, slug, fundingAgency, description, amount, currency,
      startDate, endDate, isActive,
      principalInvestigators[]-> { _id, name, slug },
      coInvestigators[]-> { _id, name, slug },
      relatedProjects[]-> { _id, title, slug },
      image { asset, alt }
    }`,
  )
}

export async function getAwards(): Promise<SanityAward[]> {
  return client.fetch<SanityAward[]>(
    `*[_type == "award"] | order(dateReceived desc) {
      _id, _type, title, slug, awardingBody, description, dateReceived,
      recipients[]-> { _id, name, slug },
      relatedProjects[]-> { _id, title, slug },
      image { asset, alt }
    }`,
  )
}

export async function getCollaborations(): Promise<SanityCollaboration[]> {
  return client.fetch<SanityCollaboration[]>(
    `*[_type == "collaboration"] | order(startDate desc) {
      _id, _type, name, slug, collaborationType, institution, description,
      startDate, endDate, isActive, website,
      relatedProjects[]-> { _id, title, slug },
      image { asset, alt }
    }`,
  )
}

export async function getPartners(): Promise<SanityPartner[]> {
  return client.fetch<SanityPartner[]>(
    `*[_type == "partner"] | order(category asc, featuredOrder asc, name asc) {
      _id, _type, name, slug, category, country, website,
      logo { asset, alt }, description, isFeatured, featuredOrder
    }`,
  )
}

export async function getPartnerships(): Promise<SanityPartnership[]> {
  return client.fetch<SanityPartnership[]>(
    `*[_type == "partnership"] | order(startDate desc) {
      _id, _type, name, slug, organization, description,
      startDate, endDate, isActive, website, contactName, contactEmail,
      relatedProjects[]-> { _id, title, slug },
      image { asset, alt }
    }`,
  )
}
