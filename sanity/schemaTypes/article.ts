import { defineArrayMember, defineField, defineType } from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'chinese',
      title: 'Chinese',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Body (Legacy Markdown)',
      type: 'text',
      rows: 24,
      description: 'Legacy markdown body kept during migration. New articles should prefer Rich Body.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const richBody = (context.document as { bodyRich?: unknown[] } | undefined)?.bodyRich
          const hasLegacyBody = typeof value === 'string' && value.trim().length > 0
          const hasRichBody = Array.isArray(richBody) && richBody.length > 0

          if (!hasLegacyBody && !hasRichBody) {
            return 'Provide either Body (Legacy Markdown) or Rich Body.'
          }

          return true
        }),
    }),
    defineField({
      name: 'bodyRich',
      title: 'Rich Body',
      type: 'array',
      description: 'Preferred rich article content for new Sanity-authored posts, including inline images.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['lqip', 'palette'],
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for screen readers and SEO.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const legacyBody = (context.document as { body?: string } | undefined)?.body
          const hasLegacyBody = typeof legacyBody === 'string' && legacyBody.trim().length > 0
          const hasRichBody = Array.isArray(value) && value.length > 0

          if (!hasLegacyBody && !hasRichBody) {
            return 'Provide either Rich Body or Body (Legacy Markdown).'
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
  },
})