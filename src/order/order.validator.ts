import z from 'zod'

const StatusTimelineSchema = z.object({
  toPay: z.date().optional(),
  toShip: z.date().optional(),
  toReceive: z.date().optional(),
  completed: z.date().optional(),
})

const PricingSchema = z.object({
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  shipping: z.number().min(0, 'Shipping fee cannot be negative').default(0),
  discount: z.number().min(0, 'Discount cannot be negative').default(0),
  total: z.number().min(0, 'Total cannot be negative'),
})

const TrackingSchema = z.object({
  carrier: z.enum(['thailand_post', 'kerry', 'flash', 'jnt', 'dhl', 'fedex']).optional(),
  trackingNumber: z.string().optional(),
})

const ShippingAddressSchema = z.object({
  recipientName: z.string().nonempty('Recipient name is required'),
  companyName: z.string().optional(),
  address: z.string().nonempty('Address is required'),
  subDistrict: z.string().nonempty('Sub district is required'),
  district: z.string().nonempty('District is required'),
  province: z.string().nonempty('Province is required'),
  postalCode: z.string().nonempty('Postal code is required'),
  phone: z.string().nonempty('Phone is required'),
})

const BillingAddressSchema = z.object({
  sameAsShipping: z.boolean().default(true),
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  subDistrict: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
})

const OrderItemSchema = z.object({
  product: z.string().nonempty('Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
})

const OrderSchema = z.object({
  orderNumber: z.string().nonempty('Order number is required'),
  customer: z.string().nonempty('Customer ID is required'),
  status: z.enum(['to_pay', 'to_ship', 'to_receive', 'completed', 'cancelled']).default('to_pay'),
  statusTimeline: StatusTimelineSchema.optional(),
  estimatedDelivery: z.date().optional(),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  pricing: PricingSchema.optional(), // Will be calculated from products
  tracking: TrackingSchema.optional(),
  shippingAddress: ShippingAddressSchema.optional(), // Can come from customer address
  addressIndex: z.number().int().optional(), // Index of address from customer addresses array
  billingAddress: BillingAddressSchema.optional(),
  sameAsShipping: z.boolean().default(true), // Whether billing address is same as shipping
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  shippingFee: z.number().min(0, 'Shipping fee cannot be negative').default(0), // Shipping fee input
  discount: z.number().min(0, 'Discount cannot be negative').default(0), // Discount input
})

const OrderValidator = {
  CreateOrder: OrderSchema,
  UpdateOrder: OrderSchema.partial(),
}

export type CreateOrderValidator = z.infer<(typeof OrderValidator)['CreateOrder']>
export type UpdateOrderValidator = z.infer<(typeof OrderValidator)['UpdateOrder']>

export default OrderValidator
