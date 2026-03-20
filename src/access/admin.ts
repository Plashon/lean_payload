import type { AccessArgs } from 'payload'

import type { Customer } from '@/payload-types'

type isAdmin = (args: AccessArgs<Customer>) => boolean

export const admin: isAdmin = ({ req }) => {
  if (req.user && req.user.collection === 'admins') {
    return true
  }
  return false
}
