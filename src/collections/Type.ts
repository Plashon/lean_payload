import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
import {
  createType,
  deleteType,
  getAllTypes,
  getTypeById,
  updateType,
} from '@/types/types.controller'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    useAsTitle: 'typeName',
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
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
    },
  ],
  endpoints: [
    {
      path: '/create-type',
      method: 'post',
      handler: createType,
    },
    {
      path: '/get-all-types',
      method: 'get',
      handler: getAllTypes,
    },
    {
      path: '/get-by-id/:id',
      method: 'get',
      handler: getTypeById,
    },
    {
      path: '/update-type/:id',
      method: 'put',
      handler: updateType,
    },
    {
      path: '/delete-type/:id',
      method: 'delete',
      handler: deleteType,
    },
  ],
}
