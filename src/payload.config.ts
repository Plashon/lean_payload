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
import { Address } from './collections/Address'
import { Models } from './collections/Model'
import { Products } from './collections/Product'
import { Types } from './collections/Type'
import { Variants } from './collections/Variant'
import { GlobalMedias } from './collections/GlobalMedia'
import { Blog } from './collections/Blog'

import { Footer } from '@/global/Footer'
import { Home } from './global/Home'
import { CMS_WarrantyServices } from './global/CMS-Warranty&Services'
import { CMS_AboutUs } from './global/CMS-AboutUs'
import { CMS_TermsConditions } from './global/CMS-Terms&Conditions'
import { CMS_PrivacyPolicy } from './global/CMS-PrivacyPolicy'
import { ContactRequests } from './collections/ContactRequests'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Admins, Models, Types, Categories, Products, Variants, Customers, Address],
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
