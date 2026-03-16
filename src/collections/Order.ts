import { admin } from '@/access/admin'
import type { CollectionConfig } from 'payload'
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from '@/order/order.controller'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: admin,
    delete: admin,
  },
  timestamps: true,
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Order Number',
      required: true,
      unique: true,
      admin: {
        description: 'e.g., #1234',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: 'Customer',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Order Status',
      required: true,
      defaultValue: 'to_pay',
      options: [
        {
          label: 'รอชำระเงิน (To pay)',
          value: 'to_pay',
        },
        {
          label: 'รอจัดส่ง (To ship)',
          value: 'to_ship',
        },
        {
          label: 'รอรับสินค้า (To receive)',
          value: 'to_receive',
        },
        {
          label: 'สำเร็จ (Completed)',
          value: 'completed',
        },
        {
          label: 'ยกเลิก (Cancelled)',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'statusTimeline',
      type: 'group',
      label: 'Status Timeline',
      fields: [
        {
          name: 'toPay',
          type: 'date',
          label: 'To Pay Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'toShip',
          type: 'date',
          label: 'To Ship Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'toReceive',
          type: 'date',
          label: 'To Receive Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'completed',
          type: 'date',
          label: 'Completed Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'estimatedDelivery',
      type: 'date',
      label: 'Estimated Delivery',
      admin: {
        description: 'e.g., Sunday, 5 Jan 2025, 07:00-19:00',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Order Items',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Quantity',
          required: true,
          defaultValue: 1,
          min: 1,
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotal',
          required: true,
          min: 0,
        },
        {
          name: 'shipping',
          type: 'number',
          label: 'Shipping Fee',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Shipping cost in THB',
          },
        },
        {
          name: 'discount',
          type: 'number',
          label: 'Discount',
          defaultValue: 0,
        },
        {
          name: 'total',
          type: 'number',
          label: 'Total',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'tracking',
      type: 'group',
      label: 'Tracking Information',
      fields: [
        {
          name: 'carrier',
          type: 'select',
          label: 'Shipping Carrier',
          options: [
            {
              label: 'Thailand Post',
              value: 'thailand_post',
            },
            {
              label: 'Kerry Express',
              value: 'kerry',
            },
            {
              label: 'Flash Express',
              value: 'flash',
            },
            {
              label: 'J&T Express',
              value: 'jnt',
            },
            {
              label: 'DHL',
              value: 'dhl',
            },
            {
              label: 'FedEx',
              value: 'fedex',
            },
          ],
        },
        {
          name: 'trackingNumber',
          type: 'text',
          label: 'Tracking Number',
          admin: {
            description: 'e.g., TH123456789',
          },
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      fields: [
        {
          name: 'recipientName',
          type: 'text',
          label: 'Recipient Name',
          required: true,
        },
        {
          name: 'companyName',
          type: 'text',
          label: 'Company Name',
          admin: {
            description: 'e.g., Kelari E-Commerce Co.,Ltd.',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          required: true,
          admin: {
            description: 'e.g., 1/7 Rama 2, Soi 54, Samaedum',
          },
        },
        {
          name: 'subDistrict',
          type: 'text',
          label: 'Sub District',
          required: true,
          admin: {
            description: 'e.g., Bangkhuntien',
          },
        },
        {
          name: 'district',
          type: 'text',
          label: 'District',
          required: true,
          admin: {
            description: 'e.g., Bangkok',
          },
        },
        {
          name: 'province',
          type: 'text',
          label: 'Province',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal Code',
          required: true,
          admin: {
            description: 'e.g., 10150',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          required: true,
          admin: {
            description: 'e.g., (66) 2896-2400',
          },
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: 'Billing Address',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          label: 'Same as Shipping Address',
          defaultValue: true,
        },
        {
          name: 'recipientName',
          type: 'text',
          label: 'Recipient Name',
        },
        {
          name: 'companyName',
          type: 'text',
          label: 'Company Name',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
        },
        {
          name: 'subDistrict',
          type: 'text',
          label: 'Sub District',
        },
        {
          name: 'district',
          type: 'text',
          label: 'District',
        },
        {
          name: 'province',
          type: 'text',
          label: 'Province',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal Code',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
        },
      ],
    },
    {
      name: 'shippingMethod',
      type: 'select',
      label: 'Shipping Method',
      defaultValue: 'standard',
      options: [
        {
          label: 'Standard Shipping',
          value: 'standard',
        },
        {
          label: 'Express Shipping',
          value: 'express',
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/create-order',
      method: 'post',
      handler: createOrder,
    },
    {
      path: '/get-all-orders',
      method: 'get',
      handler: getAllOrders,
    },
    {
      path: '/get-order/:id',
      method: 'get',
      handler: getOrderById,
    },
    {
      path: '/update-order/:id',
      method: 'put',
      handler: updateOrder,
    },
    {
      path: '/delete-order/:id',
      method: 'delete',
      handler: deleteOrder,
    },
  ],
}
