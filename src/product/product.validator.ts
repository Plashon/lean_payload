import z from 'zod'

const ProductSchema = z.object({
  productName: z.string().nonempty('Product name is required'),
  productCode: z.string().nonempty('Product code is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  stock: z.number().min(0, 'Stock cannot be negative').int('Stock must be an integer'),
  status: z.enum(['active', 'inactive']).default('active'),
  model: z.string().nonempty('Model is required'),
  variant: z.array(z.string()).nonempty('At least one variant is required'),
})

const ProductValidator = {
  CreateProduct: ProductSchema,
  UpdateProduct: ProductSchema.partial(),
}

export type CreateProductValidator = z.infer<(typeof ProductValidator)['CreateProduct']>
export type UpdateProductValidator = z.infer<(typeof ProductValidator)['UpdateProduct']>

export default ProductValidator
