import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
  fields: [
    // Email added by default
  ],
}
