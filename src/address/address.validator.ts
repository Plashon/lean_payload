import z from 'zod'

const AddressSchema = z.object({
  customer: z.string().nonempty('Customer ID is required'),
  name: z.string().nonempty('Address name is required'),
  isDefault: z.boolean().optional(),
  address: z.string().nonempty('Address is required'),
  province: z.string().nonempty('Province is required'),
  district: z.string().nonempty('District is required'),
  subDistrict: z.string().nonempty('Sub District is required'),
  postalCode: z.string().nonempty('Postal Code is required'),
})

const AddressValidator = {
  CreateAddress: AddressSchema,
  UpdateAddress: AddressSchema.partial(),
}

export type CreateAddressValidator = z.infer<(typeof AddressValidator)['CreateAddress']>
export type UpdateAddressValidator = z.infer<(typeof AddressValidator)['UpdateAddress']>
export default AddressValidator
