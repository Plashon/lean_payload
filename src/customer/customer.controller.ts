import { Payload } from 'payload'
import CustomerValidator, {
  CreateCustomerValidator,
  UpdateCustomerValidator,
} from './customer.validator'
import { ZodError } from 'zod'

/**
 * Handle validation errors and return formatted response
 */
const handleValidationError = (error: ZodError) => {
  const formattedErrors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  return {
    status: 400,
    body: {
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    },
  }
}

/**
 * Get all customers
 */
export const getAllCustomers = async (payload: Payload) => {
  try {
    const customers = await payload.find({
      collection: 'customers',
    })

    return {
      status: 200,
      body: {
        success: true,
        data: customers,
      },
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch customers',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

/**
 * Get customer by ID
 */
export const getCustomerById = async (payload: Payload, id: string) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Customer ID is required',
        },
      }
    }

    const customer = await payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Customer not found',
        },
      }
    }

    return {
      status: 200,
      body: {
        success: true,
        data: customer,
      },
    }
  } catch (error) {
    console.error('Error fetching customer:', error)
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch customer',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

/**
 * Create a new customer
 */
export const createCustomer = async (payload: Payload, data: unknown) => {
  try {
    // Validate request body
    const validationResult = CustomerValidator.CreateCustomer.safeParse(data)

    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const customerData: CreateCustomerValidator = validationResult.data

    // Check if customer with this email already exists
    const existingCustomers = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: customerData.email,
        },
      },
    })

    if (existingCustomers.docs && existingCustomers.docs.length > 0) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'Customer with this email already exists',
        },
      }
    }

    const newCustomer = await payload.create({
      collection: 'customers',
      data: customerData,
    })

    return {
      status: 201,
      body: {
        success: true,
        message: 'Customer created successfully',
        data: newCustomer,
      },
    }
  } catch (error) {
    console.error('Error creating customer:', error)
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to create customer',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

/**
 * Update a customer
 */
export const updateCustomer = async (payload: Payload, id: string, data: unknown) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Customer ID is required',
        },
      }
    }

    // Validate request body
    const validationResult = CustomerValidator.UpdateCustomer.safeParse(data)

    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const customerData: UpdateCustomerValidator = validationResult.data

    // Fetch existing customer
    const existingCustomer = await payload.findByID({
      collection: 'customers',
      id,
    })

    if (!existingCustomer) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Customer not found',
        },
      }
    }

    // Check if email is being updated and if it already exists (for another customer)
    if (customerData.email && customerData.email !== existingCustomer.email) {
      const existingEmails = await payload.find({
        collection: 'customers',
        where: {
          email: {
            equals: customerData.email,
          },
        },
      })

      if (existingEmails.docs && existingEmails.docs.length > 0) {
        return {
          status: 409,
          body: {
            success: false,
            message: 'Customer with this email already exists',
          },
        }
      }
    }

    // Check if data has changed
    const hasChanges = Object.keys(customerData).some((key) => {
      const typedKey = key as keyof typeof customerData
      return (
        (customerData[typedKey] as unknown) !==
        (existingCustomer as unknown as Record<string, unknown>)[key]
      )
    })

    if (!hasChanges) {
      return {
        status: 200,
        body: {
          success: true,
          message: 'No data has changed',
          data: existingCustomer,
        },
      }
    }

    const updatedCustomer = await payload.update({
      collection: 'customers',
      id,
      data: customerData,
    })

    return {
      status: 200,
      body: {
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer,
      },
    }
  } catch (error) {
    console.error('Error updating customer:', error)
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to update customer',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

/**
 * Delete a customer
 */
export const deleteCustomer = async (payload: Payload, id: string) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Customer ID is required',
        },
      }
    }

    await payload.delete({
      collection: 'customers',
      id,
    })

    return {
      status: 200,
      body: {
        success: true,
        message: 'Customer deleted successfully',
      },
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
    if (error instanceof Error && error.message.includes('not found')) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Customer not found',
        },
      }
    }
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to delete customer',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}
