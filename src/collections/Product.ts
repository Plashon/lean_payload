import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName'],
  },
  timestamps: true,
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
    },
    {
      name: 'productCode',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name:'price',
      type: 'number',
      required: true,
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'types',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },
  ],
}
