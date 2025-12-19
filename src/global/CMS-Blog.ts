import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const CMS_Blog: GlobalConfig = {
  slug: 'cms-blog',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'blog',
      type: 'relationship',
      relationTo: 'blog',
      label: 'Select Featured Blog',
      hasMany: false,
      required: true,
      admin: {
        description: 'Select a blog post to feature at the top',
      },
    },
  ],
}
