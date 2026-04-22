import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const publicationType = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Publication Details' },
    { name: 'authors', title: 'Authors' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publicationType',
      title: 'Publication Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Journal Article', value: 'JOURNAL' },
          { title: 'Conference Paper', value: 'CONF' },
          { title: 'Book', value: 'BOOK' },
          { title: 'Book Chapter', value: 'CHAPTER' },
          { title: 'Thesis', value: 'THESIS' },
          { title: 'Technical Report', value: 'REPORT' },
          { title: 'Preprint', value: 'PREPRINT' },
          { title: 'Other', value: 'OTHER' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      group: 'basic',
      rows: 6,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'basic',
      description: 'Optional image representing the publication (e.g., figure from paper)',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),

    // Publication Details
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: 'month',
      title: 'Month',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.min(1).max(12),
    }),
    defineField({
      name: 'journal',
      title: 'Journal',
      type: 'string',
      group: 'details',
      description: 'Journal name',
    }),
    defineField({
      name: 'conference',
      title: 'Conference',
      type: 'string',
      group: 'details',
      description: 'Conference name (for conference papers)',
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'volume',
      title: 'Volume',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'issue',
      title: 'Issue',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
      type: 'string',
      group: 'details',
      description: 'e.g., "123-145"',
    }),
    defineField({
      name: 'doi',
      title: 'DOI',
      type: 'string',
      group: 'details',
      description: 'Digital Object Identifier (without https://doi.org/)',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      group: 'details',
      description: 'Direct link to the publication',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      group: 'details',
      options: {
        accept: '.pdf',
      },
      description: 'Upload a PDF copy if available',
    }),
    defineField({
      name: 'citation',
      title: 'Full Citation',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'Complete citation in preferred format (APA, MLA, etc.)',
    }),
    defineField({
      name: 'externalId',
      title: 'External ID',
      type: 'string',
      group: 'details',
      readOnly: true,
      description: 'Unique ID from external source (SerpAPI citation_id). Managed by the sync job.',
    }),
    defineField({
      name: 'rawData',
      title: 'Raw API Data',
      type: 'text',
      group: 'details',
      readOnly: true,
      rows: 4,
      description: 'JSON payload from last sync, for debugging.',
    }),

    // Authors
    defineField({
      name: 'authors',
      title: 'Lab Member Authors',
      type: 'array',
      group: 'authors',
      of: [
        {
          type: 'reference',
          to: [{ type: 'member' }],
        },
      ],
      description: 'Select lab members who authored this publication',
    }),
    defineField({
      name: 'externalAuthors',
      title: 'External Authors',
      type: 'text',
      group: 'authors',
      description: 'Names of authors not in the lab, comma separated',
    }),
    defineField({
      name: 'authorOrder',
      title: 'Author Order (Full)',
      type: 'string',
      group: 'authors',
      description: 'Full author list in publication order (e.g., "Smith, J., Doe, A., Johnson, B.")',
    }),

    // Related Content
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    }),
    defineField({
      name: 'relatedTechnologies',
      title: 'Related Technologies',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'technology' }],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      journal: 'journal',
      publicationType: 'publicationType',
    },
    prepare({ title, year, journal, publicationType }) {
      return {
        title,
        subtitle: `${publicationType} | ${year} | ${journal || 'No venue'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: 'month', direction: 'desc' },
      ],
    },
    {
      title: 'Year (Oldest)',
      name: 'yearAsc',
      by: [{ field: 'year', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
