import { GlobalConfig } from 'payload'
import { admin } from '@/access/admin'

export const WarrantyServices: GlobalConfig = {
  slug: 'WarrantyServices',
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
          label: 'Heading',
        },
      ],
    },
    {
      name: 'header',
      type: 'text',
      label: 'Main Header',
      defaultValue: 'Warranty & Services',
      required: true,
    },
    {
      name: 'types-of-warranty',
      type: 'group',
      label: 'Types of Warranty',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          defaultValue: 'Types of Warranty',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        {
          name: 'warranties',
          type: 'array',
          label: 'Warranties',
          minRows: 2,
          maxRows: 2,
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'global-medias',
              label: 'Logo',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'detail',
              type: 'textarea',
              label: 'Detail',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'contact-hatari-suport',
      type: 'group',
      label: 'Contact Hatari Support',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          defaultValue: 'Contact Hatari Support',
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
              defaultValue: 'Contact Us',
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
        {
          name: 'backgroudImage',
          type: 'upload',
          relationTo: 'global-medias',
          required: true,
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'service-center',
      type: 'group',
      label: 'Service Center',
      fields: [
        {
          name: 'header',
          type: 'text',
          label: 'Header',
          defaultValue: 'Service Center',
          required: true,
        },
        {
          name: 'detail',
          type: 'textarea',
          label: 'Detail',
          required: true,
        },
        {
          name: 'locations',
          type: 'group',
          label: 'Locations',
          fields: [
            {
              name: 'main-location',
              type: 'group',
              label: 'Main Location',
              required: true,
              fields: [
                {
                  name: 'center-name',
                  type: 'text',
                  label: 'Center Name',
                  required: true,
                },
                {
                  name: 'contact',
                  type: 'group',
                  label: 'Contact',
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
                  ],
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
                      defaultValue: 'Contact Us',
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
            {
              name: 'secondary-location',
              type: 'array',
              label: 'Secondary Location',
              minRows: 1,
              fields: [
                {
                  name: 'center-name',
                  type: 'text',
                  label: 'Center Name',
                  required: true,
                },
                {
                  name: 'contact',
                  type: 'group',
                  label: 'Contact',
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
                          defaultValue: 'Get location',
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
            },
          ],
        },
      ],
    },
  ],
}
