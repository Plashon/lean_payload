import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'

export const CMS_PrivacyPolicy: GlobalConfig = {
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
          type: 'richText',
          label: 'Introduction',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [FixedToolbarFeature(), ...defaultFeatures],
          }),
        },
      ],
    },
  ],
}
