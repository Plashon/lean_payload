import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const CMS_TermsConditions: GlobalConfig = {
  slug: 'TermsConditions',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'terms-and-conditions',
      type: 'group',
      label: 'Terms & Conditions',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          defaultValue: 'Terms & Conditions',
          required: true,
        },
        {
          name: 'introduction',
          type: 'richText',
          label: 'Introduction',
          required: true,
        },
      ],
    },
  ],
}
