import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'global-medias',
      label: 'Logo',
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Contact Title',
          defaultValue: 'Contact us',
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Media Links',
          maxRows: 7,
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Line', value: 'line' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Phone', value: 'phone' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Twitter', value: 'twitter' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL/Link',
            },
          ],
        },
      ],
    },
    {
      name: 'menuColumns',
      type: 'array',
      label: 'Menu Columns',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column Title',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Menu Items',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'bottomSection',
      type: 'group',
      label: 'Bottom Section',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2023 Hatari. All rights reserved.',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Footer Links',
          maxRows: 3,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
