import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'

export const CMS_ContactUs: GlobalConfig = {
  slug: 'ContactUs',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'banner',
      type: 'group',
      label: 'Banner',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Background Image',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Main Heading',
        },
      ],
    },
    {
      name: 'main-title',
      type: 'group',
      label: 'Main Title',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          defaultValue: 'Location',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: true,
        },
      ],
    },
    {
      name: 'locations',
      type: 'array',
      label: 'Locations',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          required: true,
        },
        {
          name: 'operating-hours',
          type: 'text',
          label: 'Operating Hours',
          required: true,
        },
        {
          name: 'telephone-number',
          type: 'textarea',
          label: 'Telephone Number',
          admin: {
            placeholder:
              '(66) 2896-2400\nSales Department and Customer Service : Press 1\nHuman Resources Department : Press 2',
          },
          required: true,
        },
        {
          name: 'fax-number',
          type: 'text',
          label: 'Fax Number',
          required: true,
        },
      ],
    },
    {
      name: 'get-in-touch',
      type: 'group',
      label: 'Get In Touch',
      fields: [
        {
          name: 'title',
          type: 'richText',
          label: 'title',
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [FixedToolbarFeature(), ...defaultFeatures],
          }),
        },
        {
          name: 'background-image',
          type: 'upload',
          relationTo: 'global-medias',
          label: 'Background Image',
          required: true,
        },
      ],
    },
  ],
}
