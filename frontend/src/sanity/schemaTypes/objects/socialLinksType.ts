import { defineType, defineField } from 'sanity'

export const socialLinksType = defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'object',
  fields: [
    defineField({
      name: 'googleScholar',
      title: 'Google Scholar',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'researchGate',
      title: 'ResearchGate',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'orcid',
      title: 'ORCID',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter/X',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'website',
      title: 'Personal Website',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
})
