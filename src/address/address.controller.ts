import AddressValidator, {
  CreateAddressValidator,
  UpdateAddressValidator,
} from './address.validator'

/**
 * เพิ่ม address ใหม่ให้กับ customer
 */
export const addAddress = async (req: any) => {
  try {
    const { id } = req.routeParams
    const data = await req.json()

    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID',
        },
        { status: 400 },
      )
    }

    // Validate ข้อมูล
    const addressData = AddressValidator.CreateAddress.parse(data) as CreateAddressValidator

    // ดึงข้อมูล customer ปัจจุบัน
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    // ถ้าเป็น default address ให้ปรับ address อื่นๆ ให้ไม่เป็น default
    let addresses = customer.addresses || []
    if (addressData.isDefault) {
      addresses = addresses.map((addr: any) => ({
        ...addr,
        isDefault: false,
      }))
    }

    // เพิ่ม address ใหม่
    addresses.push(addressData)

    // อัพเดท customer
    const updatedCustomer = await req.payload.update({
      collection: 'customers',
      id,
      data: {
        addresses,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'เพิ่มที่อยู่เรียบร้อยแล้ว',
        data: updatedCustomer,
      },
      { status: 200 },
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          error: error.message,
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถเพิ่มที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * อัพเดท address ของ customer
 */
export const updateAddress = async (req: any) => {
  try {
    const { id, addressIndex } = req.routeParams
    const data = await req.json()

    if (!id || addressIndex === undefined) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID และ Address Index',
        },
        { status: 400 },
      )
    }

    const index = parseInt(addressIndex)

    // Validate ข้อมูล
    const addressData = AddressValidator.UpdateAddress.parse(data) as UpdateAddressValidator

    // ดึงข้อมูล customer ปัจจุบัน
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const addresses = customer.addresses || []

    if (index < 0 || index >= addresses.length) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบที่อยู่ที่ระบุ',
        },
        { status: 404 },
      )
    }

    // ถ้าเป็น default address ให้ปรับ address อื่นๆ ให้ไม่เป็น default
    if (addressData.isDefault) {
      addresses.forEach((addr: any, i: number) => {
        if (i !== index) {
          addr.isDefault = false
        }
      })
    }

    // อัพเดท address
    addresses[index] = {
      ...addresses[index],
      ...addressData,
    }

    // อัพเดท customer
    const updatedCustomer = await req.payload.update({
      collection: 'customers',
      id,
      data: {
        addresses,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'อัปเดตที่อยู่เรียบร้อยแล้ว',
        data: updatedCustomer,
      },
      { status: 200 },
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          error: error.message,
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถอัปเดตที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * ลบ address ของ customer
 */
export const deleteAddress = async (req: any) => {
  try {
    const { id, addressIndex } = req.routeParams

    if (!id || addressIndex === undefined) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID และ Address Index',
        },
        { status: 400 },
      )
    }

    const index = parseInt(addressIndex)

    // ดึงข้อมูล customer ปัจจุบัน
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const addresses = customer.addresses || []

    if (index < 0 || index >= addresses.length) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบที่อยู่ที่ระบุ',
        },
        { status: 404 },
      )
    }

    // ลบ address
    const deletedAddress = addresses[index]
    addresses.splice(index, 1)

    // ถ้า address ที่ลบเป็น default และยังมี address อื่นอยู่ ให้ตั้ง address แรกเป็น default
    if (deletedAddress.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true
    }

    // อัพเดท customer
    const updatedCustomer = await req.payload.update({
      collection: 'customers',
      id,
      data: {
        addresses,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'ลบที่อยู่เรียบร้อยแล้ว',
        data: updatedCustomer,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * ดึง address ทั้งหมดของ customer
 */
export const getAddresses = async (req: any) => {
  try {
    const { id } = req.routeParams

    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID',
        },
        { status: 400 },
      )
    }

    // ดึงข้อมูล customer
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        data: customer.addresses || [],
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * ดึง address รายการเดียวของ customer
 */
export const getAddressById = async (req: any) => {
  try {
    const { id, addressIndex } = req.routeParams

    if (!id || addressIndex === undefined) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID และ Address Index',
        },
        { status: 400 },
      )
    }

    const index = parseInt(addressIndex)

    // ดึงข้อมูล customer
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const addresses = customer.addresses || []

    if (index < 0 || index >= addresses.length) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบที่อยู่ที่ระบุ',
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        data: addresses[index],
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * ตั้งค่า address เป็น default
 */
export const setDefaultAddress = async (req: any) => {
  try {
    const { id, addressIndex } = req.routeParams

    if (!id || addressIndex === undefined) {
      return Response.json(
        {
          success: false,
          message: 'ต้องระบุ Customer ID และ Address Index',
        },
        { status: 400 },
      )
    }

    const index = parseInt(addressIndex)

    // ดึงข้อมูล customer ปัจจุบัน
    const customer = await req.payload.findByID({
      collection: 'customers',
      id,
    })

    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const addresses = customer.addresses || []

    if (index < 0 || index >= addresses.length) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบที่อยู่ที่ระบุ',
        },
        { status: 404 },
      )
    }

    // ตั้งค่า address ทั้งหมดให้ไม่เป็น default
    addresses.forEach((addr: any, i: number) => {
      addr.isDefault = i === index
    })

    // อัพเดท customer
    const updatedCustomer = await req.payload.update({
      collection: 'customers',
      id,
      data: {
        addresses,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'ตั้งค่าที่อยู่หลักเรียบร้อยแล้ว',
        data: updatedCustomer,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถตั้งค่าที่อยู่หลักได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllAddresses = async (req: any) => {
  try {
    const { id: customerId } = await req.routeParams

    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
      depth: 1,
    })
    if (!customer) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบลูกค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const addresses = customer.addresses || []
    return Response.json(
      {
        success: true,
        data: addresses,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAddressById = async (req: any) => {
  try {
    // ตรวจสอบว่าที่อยู่นี้เป็นของ customer นี้จริง
    const { id: customerId, addressId } = await req.routeParams
    const address = await req.payload.findByID({
      collection: 'address',
      id: addressId,
    })
    if (!address || address.customer !== customerId) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบที่อยู่ที่ระบุ',
        },
        { status: 404 },
      )
    }
    return Response.json(
      {
        success: true,
        data: address,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
