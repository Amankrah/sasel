import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { memberType } from './documents/memberType'
import { publicationType } from './documents/publicationType'
import { projectType } from './documents/projectType'
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
    newsType,
    settingsType,
    // Objects
    seoType,
    socialLinksType,
    blockContentType,
  ],
}
