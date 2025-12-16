import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'

export const CMS_Blog: GlobalConfig = {
  slug: 'Blog',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    // ส่วนที่ 1: Featured Blog
    {
      name: 'featuredBlog',
      type: 'group',
      label: 'Featured Blog',
      fields: [
        {
          name: 'blog',
          type: 'relationship',
          relationTo: 'blog',
          label: 'Select Featured Blog',
          required: true,
          admin: {
            description: 'Select a blog post to feature at the top',
          },
        },
      ],
    },
  ],
}
