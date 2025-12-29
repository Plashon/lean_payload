import type { CollectionConfig } from 'payload'

export const Address: CollectionConfig = {
  slug: 'address',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'address', 'province', 'district', 'customer'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        description: 'Customer who owns this address',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Address Name',
      required: true,
      admin: {
        description: 'e.g., Home, Office, Headquarters',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: 'Default Address',
      defaultValue: false,
      admin: {
        description: 'Mark this as the default address',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'province',
          type: 'text',
          label: 'Province',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'district',
          type: 'text',
          label: 'District',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'subDistrict',
          type: 'text',
          label: 'Sub District',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'postalCode',
      type: 'text',
      label: 'Postal Code',
      required: true,
      admin: {
        width: '50%',
      },
    },
  ],
}
