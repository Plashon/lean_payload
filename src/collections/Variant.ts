import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
import {
  createVariant,
  deleteVariant,
  getAllVariants,
  getVariantById,
  updateVariant,
} from '@/vairant/variant.controller'

export const Variants: CollectionConfig = {
  slug: 'variants',
  admin: {
    useAsTitle: 'variantName',
    defaultColumns: ['variantName'],
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
      name: 'variantName',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'variantCode',
      type: 'text',
      required: true,
    },
  ],
  endpoints: [
    {
      path: '/create-variant',
      method: 'post',
      handler: createVariant,
    },
    {
      path: '/get-all-variants',
      method: 'get',
      handler: getAllVariants,
    },
    {
      path: '/get-variant/:id',
      method: 'get',
      handler: getVariantById,
    },
    {
      path: '/update-variant/:id',
      method: 'put',
      handler: updateVariant,
    },
    {
      path: '/delete-variant/:id',
      method: 'delete',
      handler: deleteVariant,
    },
  ],
}
