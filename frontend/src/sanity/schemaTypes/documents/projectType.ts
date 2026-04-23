import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export const projectType = defineType({
  name: 'project',
  title: 'Research Project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Details' },
    { name: 'team', title: 'Team & Funding' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Project Title',
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
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      rows: 3,
      description: 'Brief description for project listings (max 200 characters)',
      validation: (rule) => rule.max(300),
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
      title: 'Project Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Active', value: 'ACTIVE' },
          { title: 'Completed', value: 'COMPLETED' },
          { title: 'On Hold', value: 'ON_HOLD' },
          { title: 'Upcoming', value: 'UPCOMING' },
        ],
        layout: 'radio',
      },
      initialValue: 'ACTIVE',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Project',
      type: 'boolean',
      group: 'basic',
      description: 'Show this project on the homepage (top 3 by Featured Order will appear)',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Homepage Order',
      type: 'number',
      group: 'basic',
      description: 'Order on homepage (ascending). Only used when Featured is on. Only the top 3 are shown.',
      initialValue: 100,
    }),

    // Details
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      group: 'details',
      description: 'Leave empty for ongoing projects',
    }),
    defineField({
      name: 'researchAreas',
      title: 'Research Areas',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Key research areas/topics',
    }),
    defineField({
      name: 'methodology',
      title: 'Methodology/Approach',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({
      name: 'outcomes',
      title: 'Key Outcomes/Findings',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({
      name: 'website',
      title: 'Project Website',
      type: 'url',
      group: 'details',
    }),
    defineField({
      name: 'githubRepo',
      title: 'GitHub Repository',
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
      name: 'relatedTechnologies',
      title: 'Related Technologies',
      type: 'array',
      group: 'team',
      of: [{ type: 'reference', to: [{ type: 'technology' }] }],
      description: 'Lab-built technologies used in or produced by this project',
    }),
    defineField({
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      group: 'team',
      of: [{ type: 'reference', to: [{ type: 'publication' }] }],
      description: 'Publications that came out of this project',
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
              return {
                title: name,
                subtitle: institution,
              }
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
              return {
                title: agency,
                subtitle: grantNumber,
              }
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
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
