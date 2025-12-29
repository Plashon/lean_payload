import z from 'zod'

const ContectSchema = z.object({
  fullName: z.string().min(1, 'กรุณากรอกชื่อ-นามสกุล'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  company: z.string().min(1, 'กรุณากรอกชื่อบริษัท'),
  jobTitle: z.string().min(1, 'กรุณากรอกตำแหน่งงาน'),
  interestedProducts: z.array(z.string()).min(1, 'กรุณาเลือกสินค้าที่สนใจอย่างน้อย 1 รายการ'),
  message: z.string().optional(),
})

const ContectValidator = {
  CreateContect: ContectSchema,
}

export type CreateContectValidator = z.infer<(typeof ContectValidator)['CreateContect']>

export default ContectValidator
