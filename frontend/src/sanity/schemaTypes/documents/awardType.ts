import { defineType, defineField } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const awardType = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'awardingBody', title: 'Awarding Body', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
    defineField({ name: 'dateReceived', title: 'Date Received', type: 'date' }),
    defineField({
      name: 'recipients',
      title: 'Recipients',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'member' }] }],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'awardingBody', media: 'image' },
  },
  orderings: [
    {
      title: 'Date Received (Newest)',
      name: 'dateReceivedDesc',
      by: [{ field: 'dateReceived', direction: 'desc' }],
    },
  ],
})
