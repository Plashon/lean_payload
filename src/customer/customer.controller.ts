import CustomerValidator, {
  CreateCustomerValidator,
  UpdateCustomerValidator,
} from './customer.validator'

export const createCustomer = async (req: any) => {
  try {
    const data = await req.json()
    const { email, name, password, phone } = data as CreateCustomerValidator

    // Check if customer with the same email already exists
    const existingCustomers = await req.payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingCustomers.docs && existingCustomers.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีลูกค้าที่ใช้อีเมลนี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }

    const newCustomer = await req.payload.create({
      collection: 'customers',
      data: {
        email,
        name,
        password,
        phone,
      },
    })

    return Response.json(
      {
        success: true,
        message: 'สร้างลูกค้าเรียบร้อยแล้ว',
        data: newCustomer,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างลูกค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllCustomers = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลลูกค้า' },
        { status: 403 },
      )
    }

    const {
      page = 1,
      limit = 10,
      search,
      email,
      phoneNumber,
      sortBy = '-createdAt', // เรียงลำดับ: createdAt, email, name
    } = req.query

    const where: any = {}

    // Search: ค้นหาจาก name, email, phoneNumber
    if (search) {
      where.or = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filter by email
    if (email) {
      where.email = { equals: email }
    }

    // Filter by phoneNumber
    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber }
    }

    const customers = await req.payload.find({
      collection: 'customers',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
      depth: 0,
    })

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลลูกค้าสำเร็จ',
        data: customers.docs,
        pagination: {
          total: customers.totalDocs,
          page: customers.page,
          limit: Number(limit),
          totalPages: customers.totalPages,
          hasNextPage: customers.hasNextPage,
          hasPrevPage: customers.hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลลูกค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getCustomerById = async (req: any) => {
  // console.log('REQ KEYS =>', Object.keys(req))
  // console.log('PARAMS =>', req.params)
  // console.log('ROUTE PARAMS =>', req.routeParams)

  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถดึงข้อมูลลูกค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json({
        success: false,
        message: 'กรณาระบุ ID ลูกค้า',
      })
    }

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
        data: customer,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลลูกค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateCustomer = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถดึงข้อมูลลูกค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = await req.routeParams
    if (!id) {
      return Response.json({
        success: false,
        message: 'กรณาระบุ ID ลูกค้า',
      })
    }

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

    const updateData = await req.json()
    const { email, name, phone } = updateData as UpdateCustomerValidator

    const existingEmail = await req.payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingEmail.docs && existingEmail.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีลูกค้าที่ใช้อีเมลนี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }

    const updatedCustomer = await req.payload.update({
      collection: 'customers',
      id,
      data: {
        email,
        name,
        phone,
      },
    })
    return Response.json(
      {
        success: true,
        message: 'อัปเดตข้อมูลลูกค้าเรียบร้อบแล้ว',
        data: updatedCustomer,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return Response.json({
      success: false,
      message: 'ไม่สามารถอัปเดตข้อมูลลูกค้าได้',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const deleteCustomer = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบข้อมูลลูกค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const { id } = await req.routeParams
    if (!id) {
      return Response.json({
        success: false,
        message: 'กรณาระบุ ID ลูกค้า',
      })
    }

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

    await req.payload.delete({
      collection: 'customers',
      id,
    })
    return Response.json(
      {
        success: true,
        message: 'ลบข้อมูลลูกค้าเรียบร้อยแล้ว',
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบข้อมูลลูกค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
