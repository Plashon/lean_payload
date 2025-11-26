import type { CollectionConfig } from 'payload'

export const Variants: CollectionConfig = {
  slug: 'variants',
  admin: {
    useAsTitle: 'variantName',
    defaultColumns: ['variantName'],
  },
  timestamps: true,
  fields: [
    {
      name: 'variantName',
      type: 'text',
      required: true,
    },
    {
      name:'variantCode',
      type:'text',
      required:true,
      unique:true,
    }
  ],
}
