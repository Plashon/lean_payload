import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  access: {
    read: admin,
    create: () => true,
    update: admin,
    delete: admin,
  },
  admin: {
    group: 'Forms',
    useAsTitle: 'fullName',
  },
  timestamps: true,
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company Name',
      required: true,
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
      required: true,
    },
    {
      name: 'interestedProducts',
      type: 'relationship',
      label: "I'm interested in",
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message (optional)',
    },
  ],
  endpoints: [],
}
