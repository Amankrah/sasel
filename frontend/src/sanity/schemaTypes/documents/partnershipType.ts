import { defineType, defineField } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export const partnershipType = defineType({
  name: 'partnership',
  title: 'Partnership',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'organization', title: 'Organization', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'website', title: 'Website', type: 'url' }),
    defineField({ name: 'contactName', title: 'Contact Name', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
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
    select: { title: 'name', subtitle: 'organization', media: 'image' },
  },
  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
})
