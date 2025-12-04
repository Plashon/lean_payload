import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const ProductShowcase: GlobalConfig = {
  slug: 'product-showcase',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'HARNESSING THE WIND OF CHANGE',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'products',
      type: 'array',
      label: 'Product Cards',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Product Image',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Product Title',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Product Link',
          required: true,
        },
      ],
    },
  ],
}
