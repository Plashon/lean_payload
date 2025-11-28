import type { CollectionConfig } from 'payload'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    useAsTitle: 'typeName',
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
