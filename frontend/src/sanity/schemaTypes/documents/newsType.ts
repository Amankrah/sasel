import { defineType, defineField } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const newsType = defineType({
  name: 'news',
  title: 'News & Announcements',
  type: 'document',
  icon: BellIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'metadata', title: 'Metadata' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Content
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Brief summary for news listings (max 200 characters)',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),

    // Metadata
    defineField({
      name: 'newsType',
      title: 'News Type',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'General News', value: 'NEWS' },
          { title: 'Award', value: 'AWARD' },
          { title: 'Publication', value: 'PUBLICATION' },
          { title: 'Grant', value: 'GRANT' },
          { title: 'Event', value: 'EVENT' },
          { title: 'Media Coverage', value: 'MEDIA' },
          { title: 'Team Update', value: 'TEAM' },
          { title: 'Other', value: 'OTHER' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'NEWS',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'metadata',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      group: 'metadata',
      description: 'Show this news item prominently',
      initialValue: false,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      group: 'metadata',
      description: 'Set to false to save as draft',
      initialValue: true,
    }),

    // Related Content
    defineField({
      name: 'relatedMembers',
      title: 'Related Members',
      type: 'array',
      group: 'metadata',
      of: [
        {
          type: 'reference',
          to: [{ type: 'member' }],
        },
      ],
      description: 'Lab members mentioned in this news item',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      group: 'metadata',
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
      group: 'metadata',
      of: [
        {
          type: 'reference',
          to: [{ type: 'technology' }],
        },
      ],
    }),
    defineField({
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      group: 'metadata',
      of: [
        {
          type: 'reference',
          to: [{ type: 'publication' }],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      group: 'metadata',
      description: 'Link to external news article or resource',
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
      newsType: 'newsType',
      publishedAt: 'publishedAt',
      media: 'featuredImage',
      isPublished: 'isPublished',
      isFeatured: 'isFeatured',
    },
    prepare({ title, newsType, publishedAt, media, isPublished, isFeatured }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'
      const status = !isPublished ? ' (Draft)' : ''
      const featured = isFeatured ? ' ⭐' : ''
      return {
        title: `${title}${featured}${status}`,
        subtitle: `${newsType} | ${date}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
