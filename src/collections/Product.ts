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
      name: 'price',
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
      name: 'variants',
      type: 'relationship',
      relationTo: 'variants',
      hasMany: true,
    },
  ],
}
