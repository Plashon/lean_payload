import z from 'zod'

const typeSchema = z.object({
  typeName: z.string().nonempty('Type name is required'),
  typeCode: z.string().nonempty('Type code is required'),
  category: z.string().nonempty('Category is required'),
})

const TypeValidator = {
  CreateTypeValidator: typeSchema,
  UpdateTypeValidator: typeSchema.partial(),
}

export type CreateTypeValidator = z.infer<(typeof TypeValidator)['CreateTypeValidator']>
export type UpdateTypeValidator = z.infer<(typeof TypeValidator)['UpdateTypeValidator']>

export default TypeValidator
