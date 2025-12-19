import { admin } from '@/access/admin'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '@/blog/blog.controller'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
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
      name: 'title',
      type: 'text',
      defaultValue: 'Blog name',
      required: true,
    },
    {
      name: 'summary',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [FixedToolbarFeature(), ...defaultFeatures],
      }),
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Our blog', value: 'our-blog' },
        { label: 'External Resources', value: 'external-resources' },
      ],
      required: true,
    },
  ],
  endpoints: [
    {
      path: '/create',
      method: 'post',
      handler: createBlog,
    },
    {
      path: '/get-all',
      method: 'get',
      handler: getAllBlogs,
    },
    {
      path: '/get/:id',
      method: 'get',
      handler: getBlogById,
    },
    {
      path: 'update/:id',
      method: 'put',
      handler: updateBlog,
    },
    {
      path: 'delete/:id',
      method: 'delete',
      handler: deleteBlog,
    },
  ],
}
