import z from 'zod'

const modelSchema = z.object({
  modelName: z.string().nonempty('Model name is required'),
  modelCode: z.string().nonempty('Model code is required'),
  type: z.string().nonempty('Type is required'),
})

const ModelValidator = {
  CreateModelValidator: modelSchema,
  UpdateModelValidator: modelSchema.partial(),
}

export type CreateModelValidator = z.infer<(typeof ModelValidator)['CreateModelValidator']>
export type UpdateModelValidator = z.infer<(typeof ModelValidator)['UpdateModelValidator']>

export default ModelValidator
