import type { PortableTextBlock } from 'sanity'

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

export interface SanityProjectMember {
  _id: string
  _type: 'member'
  name: string
  slug?: {
    current: string
  }
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
  members?: SanityProjectMember[]
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

export type MemberTypeValue =
  | 'PI'
  | 'PROF'
  | 'ASSOC'
  | 'POSTDOC'
  | 'PHD'
  | 'MASTERS'
  | 'RA'
  | 'SOFTWARE_ENG'
  | 'STAFF'
  | 'ALUMNI'
  | 'OTHER'

export interface SanityMember {
  _id: string
  _type: 'member'
  name: string
  slug: { current: string }
  image?: SanityImage
  memberType: MemberTypeValue
  position: string
  bio?: PortableTextBlock[]
  email?: string
  googleScholarId?: string
  website?: string
  joinedDate?: string
  leftDate?: string
  isActive?: boolean
  order?: number
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    researchGate?: string
    orcid?: string
  }
}

export type PublicationTypeValue =
  | 'JOURNAL'
  | 'CONF'
  | 'BOOK'
  | 'CHAPTER'
  | 'THESIS'
  | 'REPORT'
  | 'PREPRINT'
  | 'OTHER'

export interface SanityPublication {
  _id: string
  _type: 'publication'
  title: string
  slug: { current: string }
  publicationType: PublicationTypeValue
  abstract?: string
  featuredImage?: SanityImage
  year: number
  month?: number
  journal?: string
  conference?: string
  publisher?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  citation?: string
  externalId?: string
  rawData?: string
  authors?: SanityMember[]
  externalAuthors?: string
  authorOrder?: string
  relatedProjects?: Array<{
    _id: string
    _type: 'project'
    title: string
    slug: { current: string }
  }>
  relatedTechnologies?: Array<{
    _id: string
    _type: 'technology'
    title: string
    slug: { current: string }
  }>
  tags?: string[]
}

export interface SanityGrant {
  _id: string
  _type: 'grant'
  title: string
  slug: { current: string }
  fundingAgency?: string
  description?: PortableTextBlock[]
  amount?: number
  currency?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  principalInvestigators?: SanityMember[]
  coInvestigators?: SanityMember[]
  relatedProjects?: SanityProject[]
  image?: SanityImage
}

export interface SanityAward {
  _id: string
  _type: 'award'
  title: string
  slug: { current: string }
  awardingBody?: string
  description?: PortableTextBlock[]
  dateReceived?: string
  recipients?: SanityMember[]
  relatedProjects?: SanityProject[]
  image?: SanityImage
}

export interface SanityCollaboration {
  _id: string
  _type: 'collaboration'
  name: string
  slug: { current: string }
  collaborationType?: 'LAB' | 'PROV' | 'NAT' | 'INT'
  institution?: string
  description?: PortableTextBlock[]
  startDate?: string
  endDate?: string
  isActive?: boolean
  website?: string
  relatedProjects?: SanityProject[]
  image?: SanityImage
}

export interface SanityPartnership {
  _id: string
  _type: 'partnership'
  name: string
  slug: { current: string }
  organization?: string
  description?: PortableTextBlock[]
  startDate?: string
  endDate?: string
  isActive?: boolean
  website?: string
  contactName?: string
  contactEmail?: string
  relatedProjects?: SanityProject[]
  image?: SanityImage
}

export type TechnologyStatus = 'LIVE' | 'BETA' | 'IN_DEVELOPMENT' | 'DEPRECATED'
export type TechnologyAccent = 'emerald' | 'amber' | 'indigo' | 'blue' | 'rose' | 'slate'

export interface SanityTechnology {
  _id: string
  _type: 'technology'
  title: string
  slug: {
    current: string
  }
  tagline?: string
  description?: PortableTextBlock[]
  featuredImage?: SanityImage
  status: TechnologyStatus
  isFeatured?: boolean
  featuredOrder?: number
  accentColor?: TechnologyAccent
  launchDate?: string
  lastMajorRelease?: string
  categories?: string[]
  techStack?: string[]
  keyFeatures?: string[]
  targetUsers?: string[]
  methodology?: PortableTextBlock[]
  website?: string
  githubRepo?: string
  documentationUrl?: string
  demoUrl?: string
  members?: SanityProjectMember[]
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
  relatedProjects?: Array<{
    _id: string
    _type: 'project'
    title: string
    slug: { current: string }
  }>
  relatedPublications?: Array<{
    _id: string
    _type: 'publication'
    title: string
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
