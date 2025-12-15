import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const AboutUs: GlobalConfig = {
  slug: 'AboutUs',
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
      name: 'ourHistory',
      type: 'group',
      label: 'Our history',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'heading',
          defaultValue: 'OUR HISTORY',
        },
        {
          name: 'historyImage',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'History Image',
        },
        {
          name: 'herder',
          type: 'text',
          required: true,
          label: 'Header',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
      ],
    },
    {
      name: 'company-overview',
      type: 'group',
      label: 'Company Overview',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'heading',
          defaultValue: 'Our company at glance',
        },
        {
          name: 'sub-heading',
          type: 'text',
          required: true,
          label: 'sub-heading',
        },
        {
          name: 'companies',
          type: 'array',
          label: 'Companies',
          minRows: 1,
          maxRows: 2,
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Company Image',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Company Name',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: true,
            },
          ],
        },
        {
          name: 'our-story',
          type: 'richText',
          label: 'Our Story',
          required: true,
        },
        {
          name: 'ender-image',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
        },
      ],
    },
    {
      name: 'brand-vision',
      type: 'group',
      label: 'Brand Vision',
      fields: [
        {
          name: 'backgroudImage',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Background Image',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'heading',
          defaultValue: 'OUR VISION',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          label: 'Description',
        },
      ],
    },
    {
      name: 'tagline-banner',
      type: 'group',
      label: 'Tagline Banner',
      fields: [
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'our-values',
      type: 'group',
      label: 'Our Values',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'heading',
          defaultValue: 'OUR VALUES',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          label: 'Description',
        },
        {
          name: 'values-card',
          type: 'array',
          label: 'Values Card',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'image',
              type: 'relationship',
              relationTo: 'global-medias',
              label: 'Image',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
