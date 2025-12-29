import { admin } from '@/access/admin'
import { customer } from '@/access/customer'
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from '@/customer/customer.controller'
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: admin,
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
  ],
  endpoints: [
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
  ],
}
