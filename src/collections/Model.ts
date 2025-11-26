import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'modelName',
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
  ],
}
