import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const Banner: GlobalConfig = {
  slug: 'banner',
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
  ],
}
