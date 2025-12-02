import z from 'zod'

const VarintSchema = z.object({
  variantName: z.string().nonempty('Variant name is required'),
  variantCode: z.string().nonempty('Variant code is required'),
})

const VariantValidator = {
  CreateVariant: VarintSchema,
  UpdateVariant: VarintSchema.partial(),
}

export type CreateVariantValidator = z.infer<(typeof VariantValidator)['CreateVariant']>
export type UpdateVariantValidator = z.infer<(typeof VariantValidator)['UpdateVariant']>

export default VariantValidator
