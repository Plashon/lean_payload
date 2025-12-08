import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const Home: GlobalConfig = {
  slug: 'Home',
  access: {
    read: () => true,
    update: admin,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Banner Slides',
      minRows: 1,
      maxRows: 3,
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
        {
          name: 'description',
          type: 'textarea',
          label: 'Description Text',
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Call to Action Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              defaultValue: 'View More',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Button Link',
            },
          ],
        },
      ],
    },
    {
      name: 'autoPlaySpeed',
      type: 'number',
      label: 'Auto Play Speed (seconds)',
      defaultValue: 5,
      admin: {
        description: 'Time between slide transitions',
      },
    },
    {
      name: 'product-showcase',
      type: 'group',
      label: 'Product Showcase',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Main Heading',
          required: true,
          defaultValue: 'HARNESSING THE WIND OF CHANGE',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        {
          name: 'products',
          type: 'array',
          label: 'Product Cards',
          minRows: 1,
          maxRows: 2,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'global-medias',
              required: true,
              label: 'Product Image',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Product Title',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Content Sections',
      minRows: 1,
      maxRows: 2,
      fields: [
        {
          name: 'layout',
          type: 'select',
          label: 'Layout Type',
          required: true,
          options: [
            { label: 'Horizontal - Text Left', value: 'horizontal-text-left' },
            { label: 'Horizontal - Text Right', value: 'horizontal-text-right' },
          ],
          defaultValue: 'horizontal-text-left',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Background Image',
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Call to Action Button',
          fields: [
            {
              name: 'enabledButton',
              type: 'checkbox',
              label: 'Show Button',
              defaultValue: false,
            },
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              defaultValue: 'Contact Us',
              admin: {
                condition: (data, siblingData) => siblingData?.enabledButton,
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Button Link',
              admin: {
                condition: (data, siblingData) => siblingData?.enabledButton,
              },
            },
          ],
        },
        {
          name: 'styling',
          type: 'group',
          label: 'Styling Options',
          fields: [
            {
              name: 'textAreaBg',
              type: 'select',
              label: 'Text Area Background',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Light Beige', value: 'light-beige' },
                { label: 'Light Gray', value: 'light-gray' },
                { label: 'Light Blue', value: 'light-blue' },
              ],
              defaultValue: 'white',
            },
          ],
        },
      ],
    },
    {
      name: 'business-overview',
      type: 'group',
      label: 'Business Overview',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
        },
        {
          name: 'button',
          type: 'group',
          label: 'Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
            },
          ],
        },
      ],
    },
    {
      name: 'product-overview',
      type: 'group',
      label: 'Product Overview',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Image',
          relationTo: 'global-medias',
          required: true,
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          minRows: 3,
          fields: [
            {
              name: 'icon',
              type: 'upload',
              label: 'Icon',
              relationTo: 'global-medias',
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
    {
      name: 'brand-intro',
      type: 'group',
      label: 'Brand Introduction',
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Image',
          relationTo: 'global-medias',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Text',
          required: true,
        },
        {
          name: 'button',
          type: 'group',
          label: 'Button',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
