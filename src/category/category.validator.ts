import z from 'zod'

const CategorySchema = z.object({
  categoryName: z.string().nonempty({ message: 'ชื่อของประเภทสินค้าต้องไม่เป็นค่าว่าง' }),
  categoryCode: z.string().nonempty({ message: 'รหัสของประเภทสินค้าต้องไม่เป็นค่าว่าง' }),
})

const CategoryValidator = {
  CreateCategory: CategorySchema,
  UpdateCategory: CategorySchema.partial(),
}
export type CreateCategoryValidator = z.infer<(typeof CategoryValidator)['CreateCategory']>
export type UpdateCategoryValidator = z.infer<(typeof CategoryValidator)['UpdateCategory']>

export default CategoryValidator