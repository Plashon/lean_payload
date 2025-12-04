import type { AccessArgs } from 'payload'

import type { Customer } from '@/payload-types'

type isCustomer = (args: AccessArgs<Customer>) => boolean

export const customer: isCustomer = ({ req }) => {
  if (req.user && req.user.collection === 'customers') {
    return true
  }
  return false
}