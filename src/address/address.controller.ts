// address.controller.ts
export const createAddress = async (req: any) => {
  try {
    const { id: customerId } = await req.routeParams
    const data = await req.json()
    const { name, isDefault, address, province, district, subDistrict, postalCode } = data

    // ถ้าเป็น default ให้เปลี่ยนที่อยู่เดิมทั้งหมดเป็น non-default
    if (isDefault) {
      const customer = await req.payload.findByID({
        collection: 'customers',
        id: customerId,
        depth: 1,
      })

      if (customer?.addresses?.length > 0) {
        for (const addr of customer.addresses) {
          if (typeof addr === 'object' && addr.id) {
            await req.payload.update({
              collection: 'address',
              id: addr.id,
              data: { isDefault: false },
            })
          }
        }
      }
    }

    // สร้างที่อยู่ใหม่
    const newAddress = await req.payload.create({
      collection: 'address',
      data: {
        customer: customerId,
        name,
        isDefault: isDefault || false,
        address,
        province,
        district,
        subDistrict,
        postalCode,
      },
    })

    // อัปเดต customer เพื่อเพิ่ม relationship
    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    const currentAddresses = customer.addresses || []
    await req.payload.update({
      collection: 'customers',
      id: customerId,
      data: {
        addresses: [...currentAddresses, newAddress.id],
      },
    })

    return Response.json(
      {
        success: true,
        message: 'สร้างที่อยู่เรียบร้อยแล้ว',
        data: newAddress,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างที่อยู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateAddress = async (req: any) => {
  try {
    const { id: customerId, addressId } = await req.routeParams
    const data = await req.json()

    // ตรวจสอบว่าที่อยู่นี้เป็นของ customer นี้จริง
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

    // ถ้าจะเปลี่ยนเป็น default ให้เปลี่ยนที่อยู่อื่นเป็น non-default
    if (data.isDefault) {
      const customer = await req.payload.findByID({
        collection: 'customers',
        id: customerId,
        depth: 1,
      })

      if (customer?.addresses?.length > 0) {
        for (const addr of customer.addresses) {
          if (typeof addr === 'object' && addr.id && addr.id !== addressId) {
            await req.payload.update({
              collection: 'address',
              id: addr.id,
              data: { isDefault: false },
            })
          }
        }
      }
    }

    const updatedAddress = await req.payload.update({
      collection: 'address',
      id: addressId,
      data,
    })

    return Response.json(
      {
        success: true,
        message: 'อัปเดตที่อยู่เรียบร้อยแล้ว',
        data: updatedAddress,
      },
      { status: 200 },
    )
  } catch (error) {
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

export const deleteAddress = async (req: any) => {
  try {
    const { id: customerId, addressId } = await req.routeParams

    // ตรวจสอบว่าที่อยู่นี้เป็นของ customer นี้จริง
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

    // ลบที่อยู่
    await req.payload.delete({
      collection: 'address',
      id: addressId,
    })

    // อัปเดต customer เพื่อลบ relationship
    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    const updatedAddresses = (customer.addresses || []).filter(
      (addr: any) => addr !== addressId && addr?.id !== addressId,
    )

    await req.payload.update({
      collection: 'customers',
      id: customerId,
      data: {
        addresses: updatedAddresses,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'ลบที่อยู่เรียบร้อยแล้ว',
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
