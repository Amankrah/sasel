'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// Hardcoded for Sanity Studio deployment (these are not secrets)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3f7662lw'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'sasel-lab',
  title: 'SASEL Lab CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema,

  document: {
    // Prevent deletion of the settings singleton
    actions: (prev, context) => {
      if (context.schemaType === 'settings') {
        return prev.filter((action) => action.action !== 'delete')
      }
      return prev
    },
  },
})
