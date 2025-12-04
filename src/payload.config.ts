// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Admins } from './collections/Admin'
import { Categories } from './collections/Category'
import { Customers } from './collections/Customer'
import { Medias } from './collections/Media'
import { Models } from './collections/Model'
import { Products } from './collections/Product'
import { Types } from './collections/Type'
import { Variants } from './collections/Variant'
import { GlobalMedias } from './collections/GlobalMedia'

import { Banner } from '@/global/Banner'
import { Footer } from '@/global/Footer'
import { ContentSections } from './global/ContentSections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Banner, Footer, ContentSections],
  collections: [
    Admins,
    Models,
    Types,
    Categories,
    Products,
    Variants,
    Customers,
    Medias,
    GlobalMedias,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
