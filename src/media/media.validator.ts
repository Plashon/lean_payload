import z from 'zod'

const MediaSchema = z.object({
  alt: z.string().min(1, 'Alt text is required'), // 👈 ใช้ min(1) แทน nonempty()
  product: z.string().min(1, 'Product ID is required'),
})

const MediaValidator = {
  CreateMedia: MediaSchema,
  UpdateMedia: MediaSchema.partial(),
}

export default MediaValidator
