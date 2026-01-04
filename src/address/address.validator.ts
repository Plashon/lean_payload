import z from 'zod'

const AddressSchema = z.object({
  name: z.string().nonempty('ต้องระบุชื่อที่อยู่'),
  isDefault: z.boolean().optional().default(false),
  address: z.string().nonempty('ต้องระบุที่อยู่'),
  province: z.string().nonempty('ต้องระบุจังหวัด'),
  district: z.string().nonempty('ต้องระบุเขต/อำเภอ'),
  subDistrict: z.string().nonempty('ต้องระบุแขวง/ตำบล'),
  postalCode: z.string().nonempty('ต้องระบุรหัสไปรษณีย์'),
})

const AddressValidator = {
  CreateAddress: AddressSchema,
  UpdateAddress: AddressSchema.partial(),
}

export type CreateAddressValidator = z.infer<(typeof AddressValidator)['CreateAddress']>
export type UpdateAddressValidator = z.infer<(typeof AddressValidator)['UpdateAddress']>
export default AddressValidator
