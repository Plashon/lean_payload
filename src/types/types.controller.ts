import { CreateTypeValidator, UpdateTypeValidator } from './types.validator'

export const createType = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถสร้างประเภทสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const typeData = await req.json()
    const { typeName, typeCode, category } = typeData as CreateTypeValidator

    const existingType = await req.payload.find({
      collection: 'types',
      where: {
        or: [
          {
            typeName: {
              equals: typeName,
            },
          },
          {
            typeCode: {
              equals: typeCode,
            },
          },
        ],
      },
    })

    if (existingType.docs && existingType.docs.length > 0) {
      return Response.json(
        { success: false, message: 'มีประเภทสินค้านี้อยู่แล้ว' },
        { status: 409 },
      )
    }
    const categoryData = await req.payload.findByID({
      collection: 'categories',
      id: category,
    })
    if (!category) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบประเภทสินค้าที่ระบุ',
        },
        {
          status: 404,
        },
      )
    }
    const newType = await req.payload.create({
      collection: 'types',
      data: { typeName, typeCode, category: categoryData.id },
    })
    return Response.json(
      { success: true, message: 'สร้างประเภทสินค้าเรียบร้อยแล้ว', data: newType },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างประเภทสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllTypes = async (req: any) => {
  try {
    const types = await req.payload.find({
      collection: 'types',
    })
    if (!types || types.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบประเภทสินค้า' }, { status: 404 })
    }
    return Response.json(
      { success: true, message: 'ดึงข้อมูลประเภทสินค้าสำเร็จ', data: types.docs },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลประเภทสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getTypeById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรณาระบุ ID ประเภทสินค้า' }, { status: 400 })
    }
    const type = await req.payload.findByID({
      collection: 'types',
      id: id,
    })
    if (!type || type.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบประเภทสินค้าที่ระบุ' }, { status: 404 })
    }
    return Response.json(
      { success: true, message: 'ดึงข้อมูลประเภทสินค้าสำเร็จ', data: type },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลประเภทสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateType = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไขประเภทสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรณาระบุ ID ประเภทสินค้า' }, { status: 400 })
    }

    const updateData = await req.json()
    const { typeName, typeCode, category } = updateData as UpdateTypeValidator
    const categoryData = await req.payload.findByID({
      collection: 'categories',
      id: category,
    })
    if (!categoryData) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบประเภทสินค้าที่ระบุ',
        },
        {
          status: 404,
        },
      )
    }
    const existingType = await req.payload.find({
      collection: 'types',
      where: {
        or: [
          {
            typeName: {
              equals: typeName,
            },
          },
          {
            typeCode: {
              equals: typeCode,
            },
          },
        ],
        not: id,
      },
    })
    if (existingType.docs && existingType.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีประเภทสินค้านี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }

    const updatedType = await req.payload.update({
      collection: 'types',
      id: id,
      data: { typeName, typeCode, category: categoryData.id },
    })
    return Response.json(
      { success: true, message: 'แก้ไขข้อมูลประเภทสินค้าเรียบร้อยแล้ว', data: updatedType },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขข้อมูลประเภทสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}

export const deleteType = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบข้อมูลประเภทสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID ประเภทสินค้า',
        },
        {
          status: 400,
        },
      )
    }

    const type = await req.payload.findByID({
      collection: 'types',
      id: id,
    })
    if (!type || type.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบประเภทสินค้าที่ระบุ',
        },
        {
          status: 404,
        },
      )
    }

    const deletedType = await req.payload.delete({
      collection: 'types',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบข้อมูลประเภทสินค้าเรียบร้อยแล้ว', data: deletedType },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบข้อมูลประเภทสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}
