import z from 'zod'

const CategorySchema = z.object({
  categoryName: z.string().nonempty('Category name is required'),
  categoryCode: z.string().nonempty('Category code is required'),
})

const CategoryValidator = {
  CreateCategory: CategorySchema,
  UpdateCategory: CategorySchema.partial(),
}

export type CreateCategoryValidator = z.infer<(typeof CategoryValidator)['CreateCategory']>
export type UpdateCategoryValidator = z.infer<(typeof CategoryValidator)['UpdateCategory']>

export default CategoryValidator
