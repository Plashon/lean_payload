import z from 'zod'

const CustomerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().nonempty(),
  phone: z.string().optional(),
})

const CustomerValidator = {
  CreateCustomer: CustomerSchema,
  UpdateCustomer: CustomerSchema.partial(),
}

export type CreateCustomerValidator = z.infer<(typeof CustomerValidator)['CreateCustomer']>
export type UpdateCustomerValidator = z.infer<(typeof CustomerValidator)['UpdateCustomer']>

export default CustomerValidator
