import { defineType, defineField } from 'sanity'
import { TrolleyIcon } from '@sanity/icons'

export const grantType = defineType({
  name: 'grant',
  title: 'Grant',
  type: 'document',
  icon: TrolleyIcon,
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
    defineField({ name: 'fundingAgency', title: 'Funding Agency', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
    defineField({ name: 'amount', title: 'Amount', type: 'number' }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'CAD',
    }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'principalInvestigators',
      title: 'Principal Investigators',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'member' }] }],
    }),
    defineField({
      name: 'coInvestigators',
      title: 'Co-Investigators',
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
    select: { title: 'title', subtitle: 'fundingAgency', media: 'image' },
  },
  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
})
