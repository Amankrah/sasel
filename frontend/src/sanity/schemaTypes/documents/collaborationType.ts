import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const collaborationType = defineType({
  name: 'collaboration',
  title: 'Collaboration',
  type: 'document',
  icon: UsersIcon,
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
    defineField({
      name: 'collaborationType',
      title: 'Collaboration Type',
      type: 'string',
      options: {
        list: [
          { title: 'Other Lab', value: 'LAB' },
          { title: 'Provincial', value: 'PROV' },
          { title: 'National', value: 'NAT' },
          { title: 'International', value: 'INT' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'institution', title: 'Institution', type: 'string' }),
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
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'institution', media: 'image' },
  },
  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
})
