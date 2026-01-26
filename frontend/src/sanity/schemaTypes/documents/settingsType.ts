import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'Default SEO' },
    { name: 'social', title: 'Social Media' },
    { name: 'contact', title: 'Contact Info' },
  ],
  fields: [
    // General
    defineField({
      name: 'labName',
      title: 'Lab Name',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'labAcronym',
      title: 'Lab Acronym',
      type: 'string',
      group: 'general',
      description: 'e.g., "SASEL"',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Lab Description',
      type: 'text',
      group: 'general',
      rows: 4,
    }),
    defineField({
      name: 'logo',
      title: 'Lab Logo',
      type: 'image',
      group: 'general',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'university',
      title: 'University/Institution',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      group: 'general',
    }),

    // Default SEO
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Default Meta Title',
          description: 'Used when pages don\'t have their own meta title',
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Default Meta Description',
          rows: 3,
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Default Keywords',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Default Social Share Image',
          description: 'Default image for social media sharing (1200x630px recommended)',
        },
      ],
    }),

    // Social Media
    defineField({
      name: 'socialLinks',
      title: 'Lab Social Media',
      type: 'object',
      group: 'social',
      fields: [
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'github', type: 'url', title: 'GitHub' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
        { name: 'researchGate', type: 'url', title: 'ResearchGate' },
      ],
    }),

    // Contact
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'street', type: 'string', title: 'Street Address' },
        { name: 'building', type: 'string', title: 'Building/Room' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      group: 'contact',
      rows: 2,
      description: 'Additional text to display in the footer',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
