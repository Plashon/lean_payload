import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
} from '@/media/media.controller'

export const Medias: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
  },
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false, // 👈 เปลี่ยนเป็น false เพราะจะ validate ใน controller เอง
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: false, // 👈 เปลี่ยนเป็น false
    },
  ],
  endpoints: [
    { path: '/create-media', method: 'post', handler: createMedia },
    { path: '/get-all-media', method: 'get', handler: getAllMedia },
    { path: '/get-media/:id', method: 'get', handler: getMediaById },
    { path: '/update-media/:id', method: 'put', handler: updateMedia },
    { path: '/delete-media/:id', method: 'delete', handler: deleteMedia },
  ],
}
