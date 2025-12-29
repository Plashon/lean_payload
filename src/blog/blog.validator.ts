import z from 'zod'

const BlogSchema = z.object({
  blog: z.string().nonempty('Blog name is required'),
  summary: z.string().nonempty('Summary is required'),
  type: z.enum(['our-blog', 'external-resources']).default('our-blog'),
})

const BlogValidator = {
  CreateBlog: BlogSchema,
  UpdateBlog: BlogSchema.partial(),
}

export type CreateBlogValidator = z.infer<(typeof BlogValidator)['CreateBlog']>
export type UpdateBlogValidator = z.infer<(typeof BlogValidator)['UpdateBlog']>

export default BlogValidator
