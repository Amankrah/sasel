import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const memberType = defineType({
  name: 'member',
  title: 'Lab Member',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'academic', title: 'Academic' },
    { name: 'social', title: 'Social & Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility',
        },
      ],
    }),
    defineField({
      name: 'memberType',
      title: 'Member Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Principal Investigator', value: 'PI' },
          { title: 'Professor', value: 'PROF' },
          { title: 'Research Associate', value: 'ASSOC' },
          { title: 'Postdoctoral Fellow', value: 'POSTDOC' },
          { title: 'PhD Researcher', value: 'PHD' },
          { title: 'Masters Student', value: 'MASTERS' },
          { title: 'International Student', value: 'INTL_STUDENT' },
          { title: 'Intern', value: 'INTERN' },
          { title: 'Research Assistant', value: 'RA' },
          { title: 'Software Engineer', value: 'SOFTWARE_ENG' },
          { title: 'Staff', value: 'STAFF' },
          { title: 'Alumni', value: 'ALUMNI' },
          { title: 'Other', value: 'OTHER' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position/Title',
      type: 'string',
      group: 'basic',
      description: 'e.g., "Associate Professor of Computer Science"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      group: 'basic',
      rows: 4,
      description: 'Brief bio for member listings (max 300 characters)',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Biography',
      type: 'blockContent',
      group: 'basic',
      description: 'Extended biography for member detail page',
    }),
    defineField({
      name: 'isActive',
      title: 'Currently Active',
      type: 'boolean',
      group: 'basic',
      description: 'Is this member currently part of the lab?',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'basic',
      description: 'Lower numbers appear first (PI should be 1)',
      initialValue: 99,
    }),

    // Academic Info
    defineField({
      name: 'researchInterests',
      title: 'Research Interests',
      type: 'array',
      group: 'academic',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Key areas of research focus',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'academic',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'degree', type: 'string', title: 'Degree' },
            { name: 'field', type: 'string', title: 'Field of Study' },
            { name: 'institution', type: 'string', title: 'Institution' },
            { name: 'year', type: 'number', title: 'Year' },
          ],
          preview: {
            select: {
              degree: 'degree',
              field: 'field',
              institution: 'institution',
              year: 'year',
            },
            prepare({ degree, field, institution, year }) {
              return {
                title: `${degree} in ${field || 'N/A'}`,
                subtitle: `${institution} (${year || 'N/A'})`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'googleScholarId',
      title: 'Google Scholar ID',
      type: 'string',
      group: 'academic',
      description: 'The ID from the Google Scholar profile URL',
    }),
    defineField({
      name: 'joinedDate',
      title: 'Joined Date',
      type: 'date',
      group: 'academic',
    }),
    defineField({
      name: 'leftDate',
      title: 'Left Date',
      type: 'date',
      group: 'academic',
      description: 'Only fill if member has left the lab',
    }),

    // Social & Contact
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'social',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & Academic Profiles',
      type: 'socialLinks',
      group: 'social',
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
      title: 'name',
      memberType: 'memberType',
      position: 'position',
      media: 'image',
      isActive: 'isActive',
    },
    prepare({ title, memberType, position, media, isActive }) {
      const status = isActive ? '' : ' (Alumni)'
      return {
        title: `${title}${status}`,
        subtitle: `${memberType} | ${position || 'No position'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
