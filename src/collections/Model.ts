import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'modelName',
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
      name: 'modelName',
      type: 'text',
      required: true,
    },
    {
      name: 'modelCode',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'types',
      required: true,
    },
  ],
}
