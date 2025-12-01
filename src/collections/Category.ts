import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'categoryName',
    defaultColumns: ['categoryName'],
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
      name: 'categoryName',
      label: 'Category name',
      type: 'text',
      required: true,
    },
    {
      name: 'categoryCode',
      label: 'Category code',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
  endpoints: [],
}
