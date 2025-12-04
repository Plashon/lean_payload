import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
import {
  createModel,
  deleteModel,
  getAllModels,
  getModelById,
  updateModel,
} from '@/models/model.controller'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'modelName',
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
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'types',
      required: true,
    },
  ],
  endpoints: [
    {
      path: '/create-model',
      method: 'post',
      handler: createModel,
    },
    {
      path: '/get-all-models',
      method: 'get',
      handler: getAllModels,
    },
    {
      path: '/get-by-id/:id',
      method: 'get',
      handler: getModelById,
    },
    {
      path: '/update-model/:id',
      method: 'put',
      handler: updateModel,
    },
    {
      path: '/delete-model/:id',
      method: 'delete',
      handler: deleteModel,
    },
  ],
}
