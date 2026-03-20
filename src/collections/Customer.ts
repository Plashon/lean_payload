import { admin } from '@/access/admin'
import { customer } from '@/access/customer'
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from '@/customer/customer.controller'
import {
  addAddress,
  deleteAddress,
  getAddresses,
  getAddressById,
  setDefaultAddress,
  updateAddress,
} from '@/address/address.controller'

import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    create: () => true,
    update: customer,
    delete: admin,
  },
  timestamps: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      label: 'Addresses',
      fields: [
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
    },
  ],
  endpoints: [
    // Customer endpoints
    {
      path: '/create',
      method: 'post',
      handler: createCustomer,
    },
    {
      path: '/get-customers',
      method: 'get',
      handler: getAllCustomers,
    },
    {
      path: '/get-by-id/:id',
      method: 'get',
      handler: getCustomerById,
    },
    {
      path: '/update-customer/:id',
      method: 'put',
      handler: updateCustomer,
    },
    {
      path: '/delete-customer/:id',
      method: 'delete',
      handler: deleteCustomer,
    },
    // Address endpoints
    {
      path: '/:id/addresses',
      method: 'get',
      handler: getAddresses,
    },
    {
      path: '/:id/addresses/:addressIndex',
      method: 'get',
      handler: getAddressById,
    },
    {
      path: '/:id/addresses',
      method: 'post',
      handler: addAddress,
    },
    {
      path: '/:id/addresses/:addressIndex',
      method: 'put',
      handler: updateAddress,
    },
    {
      path: '/:id/addresses/:addressIndex',
      method: 'delete',
      handler: deleteAddress,
    },
    {
      path: '/:id/addresses/:addressIndex/set-default',
      method: 'patch',
      handler: setDefaultAddress,
    },
  ],
}
