import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const GlobalMedias: CollectionConfig = {
  slug: 'global-medias',
  access: {
    read: () => true, // Public - ทุกคนเข้าถึงได้
    create: admin, // เฉพาะ admin สร้างได้
    update: admin, // เฉพาะ admin แก้ไขได้
    delete: admin, // เฉพาะ admin ลบได้
  },
  admin: {
    useAsTitle: 'alt',
    group: 'CMS',
  },
  upload: {
    staticDir: 'media', // โฟลเดอร์เก็บไฟล์
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'], // รับเฉพาะไฟล์รูปภาพ
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
