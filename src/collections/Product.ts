import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName'],
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
      hooks: {
        beforeChange: [
          async ({ value }) => {
            if (value < 0) {
              value = 0
              throw new Error('Price cannot be negative')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'variants',
      hasMany: true,
    },
  ],
}
