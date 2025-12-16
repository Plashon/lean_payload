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
    useAsTitle: 'blog',
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
      name: 'blog',
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
      path: '/',
      method: 'post',
      handler: createBlog,
    },
    {
      path: '/',
      method: 'get',
      handler: getAllBlogs,
    },
    {
      path: '/:id',
      method: 'get',
      handler: getBlogById,
    },
    {
      path: '/:id',
      method: 'put',
      handler: updateBlog,
    },
    {
      path: '/:id',
      method: 'delete',
      handler: deleteBlog,
    },
  ],
}
