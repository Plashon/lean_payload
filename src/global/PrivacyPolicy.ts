import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'PrivacyPolicy',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'privacy-policy',
      type: 'group',
      label: 'Privacy policy',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          defaultValue: 'Privacy policy',
          required: true,
        },
        {
          name: 'introduction',
          type: 'textarea',
          label: 'Introduction',
          required: true,
        },
        {
          name: 'quick-navigation',
          type: 'array',
          label: 'Quick Navigation',
          minRows: 1,
          maxRows: 2,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      label: 'Content',
      fields: [
        {
          name: 'header',
          type: 'text',
          label: 'Header',
          required: true,
        },
        {
          name: 'title',
          type: 'richText',
          label: 'Title',
          required: true,
        },
      ],
    },
  ],
}
