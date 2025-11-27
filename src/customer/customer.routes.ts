import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customer.controller'

/**
 * GET /api/customers
 * Fetch all customers
 */
export const GET = async (request: Request) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await getAllCustomers(payload)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    console.error('Route error:', error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/customers
 * Create a new customer
 */
export const POST = async (request: Request) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const data = await request.json()
    const result = await createCustomer(payload, data)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    console.error('Route error:', error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/customers/[id]
 * Fetch a customer by ID
 */
export const getCustomerRoute = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const { id } = await context.params
    const result = await getCustomerById(payload, id)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    console.error('Route error:', error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/customers/[id]
 * Update a customer by ID
 */
export const putCustomerRoute = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const { id } = await context.params
    const data = await request.json()
    const result = await updateCustomer(payload, id, data)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    console.error('Route error:', error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/customers/[id]
 * Delete a customer by ID
 */
export const deleteCustomerRoute = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const { id } = await context.params
    const result = await deleteCustomer(payload, id)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    console.error('Route error:', error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
