import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/category/category.controller'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'categoryName',
    defaultColumns: ['categoryName'],
  },
  access: {
    read: () => true,
    create: admin,
    update: admin,
    delete: admin,
  },
  timestamps: true,
  fields: [
    {
      name: 'categoryName',
      label: 'Category name',
      type: 'text',
      required: true,
    },
    {
      name: 'categoryCode',
      label: 'Category code',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
  endpoints: [
    {
      path: '/all-categories',
      method: 'get',
      handler: getAllCategories,
    },
    {
      path: '/create-category',
      method: 'post',
      handler: createCategory,
    },
    {
      path: '/get-by-id/:id',
      method: 'get',
      handler: getCategoryById,
    },
    {
      path: '/update-category/:id',
      method: 'put',
      handler: updateCategory,
    },
    {
      path: '/delete-category/:id',
      method: 'delete',
      handler: deleteCategory,
    },
  ],
}
