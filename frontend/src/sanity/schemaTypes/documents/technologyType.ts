import { defineType, defineField } from 'sanity'
import { CodeBlockIcon } from '@sanity/icons'

export const technologyType = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  icon: CodeBlockIcon,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Platform Details' },
    { name: 'team', title: 'Team & Funding' },
    { name: 'media', title: 'Media' },
    { name: 'related', title: 'Related Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Technology Name',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'basic',
      description: 'One-line pitch shown on cards and detail header',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'basic',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Lifecycle Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Live', value: 'LIVE' },
          { title: 'Beta', value: 'BETA' },
          { title: 'In Development', value: 'IN_DEVELOPMENT' },
          { title: 'Deprecated', value: 'DEPRECATED' },
        ],
        layout: 'radio',
      },
      initialValue: 'LIVE',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Technology',
      type: 'boolean',
      group: 'basic',
      description: 'Show on the homepage technologies section',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Homepage Order',
      type: 'number',
      group: 'basic',
      description: 'Order on homepage (ascending). Only used when Featured is on.',
      initialValue: 100,
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      group: 'basic',
      description: 'Drives gradient on homepage/card header',
      options: {
        list: [
          { title: 'Emerald / Green (nutrition, environment)', value: 'emerald' },
          { title: 'Amber / Orange (process, analysis)', value: 'amber' },
          { title: 'Indigo / Purple (AI, analytics)', value: 'indigo' },
          { title: 'Blue / Teal (data, research)', value: 'blue' },
          { title: 'Rose / Pink', value: 'rose' },
          { title: 'Slate / Dark (platforms, tooling)', value: 'slate' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'emerald',
    }),

    // Platform Details
    defineField({
      name: 'launchDate',
      title: 'Launch Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'lastMajorRelease',
      title: 'Last Major Release',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g., "Life Cycle Assessment", "Decision Support", "AI"',
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Frameworks, languages, and libraries (e.g., "Next.js", "Django", "Rust")',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Headline capabilities shown on cards and detail page',
    }),
    defineField({
      name: 'targetUsers',
      title: 'Target Users',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'Who this technology is for',
    }),
    defineField({
      name: 'methodology',
      title: 'Methodology / Methods',
      type: 'blockContent',
      group: 'details',
      description: 'Methods, models, or frameworks that underpin the technology',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'githubRepo',
      title: 'GitHub Repository',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'documentationUrl',
      title: 'Documentation URL',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo / Video URL',
      type: 'url',
      group: 'details',
    }),

    // Team & Funding
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'reference',
          to: [{ type: 'member' }],
        },
      ],
    }),
    defineField({
      name: 'collaborators',
      title: 'External Collaborators',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'institution', type: 'string', title: 'Institution' },
            { name: 'website', type: 'url', title: 'Website' },
          ],
          preview: {
            select: { name: 'name', institution: 'institution' },
            prepare({ name, institution }) {
              return { title: name, subtitle: institution }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'funding',
      title: 'Funding Sources',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'agency', type: 'string', title: 'Funding Agency' },
            { name: 'grantNumber', type: 'string', title: 'Grant Number' },
            { name: 'amount', type: 'number', title: 'Amount' },
            { name: 'currency', type: 'string', title: 'Currency', initialValue: 'USD' },
          ],
          preview: {
            select: { agency: 'agency', grantNumber: 'grantNumber' },
            prepare({ agency, grantNumber }) {
              return { title: agency, subtitle: grantNumber }
            },
          },
        },
      ],
    }),

    // Media
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Video Title' },
            { name: 'url', type: 'url', title: 'Video URL (YouTube, Vimeo, etc.)' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
          preview: {
            select: { title: 'title', url: 'url' },
            prepare({ title, url }) {
              return { title, subtitle: url }
            },
          },
        },
      ],
    }),

    // Related Content
    defineField({
      name: 'relatedProjects',
      title: 'Related Research Projects',
      type: 'array',
      group: 'related',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    }),
    defineField({
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      group: 'related',
      of: [
        {
          type: 'reference',
          to: [{ type: 'publication' }],
        },
      ],
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
      status: 'status',
      media: 'featuredImage',
      isFeatured: 'isFeatured',
    },
    prepare({ title, status, media, isFeatured }) {
      const featured = isFeatured ? ' ⭐' : ''
      return {
        title: `${title}${featured}`,
        subtitle: status,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Featured Order (Homepage)',
      name: 'featuredOrderAsc',
      by: [{ field: 'featuredOrder', direction: 'asc' }],
    },
    {
      title: 'Launch Date (Newest)',
      name: 'launchDateDesc',
      by: [{ field: 'launchDate', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
