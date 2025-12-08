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
      name: 'sections',
      type: 'array',
      label: 'Content Sections',
      fields: [
        {
          name: 'layout',
          type: 'select',
          label: 'Layout Type',
          required: true,
          options: [
            { label: 'Horizontal - Text Left', value: 'horizontal-text-left' },
            { label: 'Horizontal - Text Right', value: 'horizontal-text-right' },
            { label: 'Vertical - Text Top', value: 'vertical-text-top' },
            { label: 'Vertical - Text Bottom', value: 'vertical-text-bottom' },
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
          label: 'Section Image',
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
            {
              name: 'imageAreaBg',
              type: 'select',
              label: 'Image Area Background',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Light Yellow', value: 'light-yellow' },
                { label: 'Light Blue', value: 'light-blue' },
                { label: 'Light Green', value: 'light-green' },
                { label: 'Light Cyan', value: 'light-cyan' },
              ],
              defaultValue: 'light-yellow',
            },
          ],
        },
      ],
    },
  ],
}
