import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { memberType } from './documents/memberType'
import { publicationType } from './documents/publicationType'
import { projectType } from './documents/projectType'
import { technologyType } from './documents/technologyType'
import { collaborationType } from './documents/collaborationType'
import { grantType } from './documents/grantType'
import { awardType } from './documents/awardType'
import { partnershipType } from './documents/partnershipType'
import { partnerType } from './documents/partnerType'
import { newsType } from './documents/newsType'
import { settingsType } from './documents/settingsType'

// Object types
import { seoType } from './objects/seoType'
import { socialLinksType } from './objects/socialLinksType'
import { blockContentType } from './objects/blockContentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    memberType,
    publicationType,
    projectType,
    technologyType,
    collaborationType,
    grantType,
    awardType,
    partnershipType,
    partnerType,
    newsType,
    settingsType,
    // Objects
    seoType,
    socialLinksType,
    blockContentType,
  ],
}
