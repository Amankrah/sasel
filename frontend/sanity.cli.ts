import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3f7662lw'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: 'w4rpfogu8bfxq82ns4iwnemk',
  },
})
