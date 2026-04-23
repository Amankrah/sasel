import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const partnerType = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'visibility', title: 'Visibility' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Funder / Sponsor', value: 'FUNDER' },
          { title: 'Academic / Research', value: 'ACADEMIC' },
          { title: 'Government / Agency', value: 'GOVERNMENT' },
          { title: 'Industry / NGO', value: 'INDUSTRY' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'basic',
      description: 'Home country or region. Used as a subtitle on cards.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'basic',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
      description: 'Optional. If missing, a letter avatar is used on the card.',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      rows: 2,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Sponsor',
      type: 'boolean',
      group: 'visibility',
      description:
        'Show in the top sponsor logo band on the homepage. Typically funders and major institutional partners.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Display Order',
      type: 'number',
      group: 'visibility',
      description: 'Ascending order within each category. Lower numbers render first.',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      country: 'country',
      media: 'logo',
      isFeatured: 'isFeatured',
    },
    prepare({ title, category, country, media, isFeatured }) {
      const subtitle = [category, country].filter(Boolean).join(' | ')
      const star = isFeatured ? ' ⭐' : ''
      return { title: `${title}${star}`, subtitle, media }
    },
  },
  orderings: [
    {
      title: 'Category, then Display Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'featuredOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    { title: 'Name A-Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
})
