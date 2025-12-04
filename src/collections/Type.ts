import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    useAsTitle: 'typeName',
  },
  access: {
      read: () => true,
      create: admin,
      update: admin,
      delete: admin,
    },
  timestamps: true,
  fields: [
    {
      name: 'typeName',
      type: 'text',
      required: true,
    },
    {
      name: 'typeCode',
      type: 'text',
      required: true,
    },
    {
      name: 'catagory',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
    },
  ],
}
