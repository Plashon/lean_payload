import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'categoryName',
    defaultColumns: ['categoryName'],
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
      name:'cayegoryCode',
      label: 'Category code',
      type: 'text',
      required: true,
      unique: true,
    }
  ],
}
