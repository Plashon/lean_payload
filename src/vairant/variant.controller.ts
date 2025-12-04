import { CreateVariantValidator, UpdateVariantValidator } from './variant.validator'

export const createVariant = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถสร้างตัวแปรได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const variantData = await req.json()
    const { variantName, variantCode } = variantData as CreateVariantValidator

    const existingVariant = await req.payload.find({
      collection: 'variants',
      where: {
        variantName: {
          equals: variantName,
        },
      },
    })

    if (existingVariant.docs && existingVariant.docs.length > 0) {
      return Response.json({ success: false, message: 'มีตัวแปรนี้อยู่แล้ว' }, { status: 409 })
    }
    const newVariant = await req.payload.create({
      collection: 'variants',
      data: { variantName, variantCode },
    })
    return Response.json(
      { success: true, message: 'สร้างตัวแปรเรียบร้อยแล้ว', data: newVariant },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างตัวแปรได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllVariants = async (req: any) => {
  try {
    // Query parameters
    const {
      page = 1, // หน้าเริ่มต้น
      limit = 10, // จำนวนต่อหน้า
      search, // ค้นหาจากชื่อหรือรหัสตัวแปร
    } = req.query

    // ---------------------------
    // Build the "where" filter
    // ---------------------------
    const where: any = {}

    // Search by variantName or variantCode
    if (search) {
      where.or = [
        { variantName: { contains: search, mode: 'insensitive' } },
        { variantCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    // ---------------------------
    // Query PayloadCMS
    // ---------------------------
    const variants = await req.payload.find({
      collection: 'variants',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: '-createdAt',
    })

    if (!variants || variants.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบตัวแปร',
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลตัวแปรสำเร็จ',
        data: variants.docs,
        total: variants.totalDocs,
        page: variants.page,
        totalPages: variants.totalPages,
        pagination: {
          total: variants.totalDocs,
          page: variants.page,
          limit: Number(limit),
          pages: variants.totalPages,
          hasNextPage: variants.hasNextPage,
          hasPrevPage: variants.page > 1,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลตัวแปรได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getVariantById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรุณาระบุ ID ตัวแปร' }, { status: 400 })
    }
    const variant = await req.payload.findByID({
      collection: 'variants',
      id: id,
    })
    if (!variant) {
      return Response.json({ success: false, message: 'ไม่พบตัวแปรที่ระบุ' }, { status: 404 })
    }
    return Response.json(
      { success: true, message: 'ดึงข้อมูลตัวแปรสำเร็จ', data: variant },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลตัวแปรได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateVariant = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไขตัวแปรได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรุณาระบุ ID ตัวแปร' }, { status: 400 })
    }

    const updateData = await req.json()
    const { variantName, variantCode } = updateData as UpdateVariantValidator

    const existingVariant = await req.payload.find({
      collection: 'variants',
      where: {
        variantName: {
          equals: variantName,
        },
      },
    })

    if (existingVariant.docs && existingVariant.docs.length > 0) {
      const isDuplicate = existingVariant.docs.some((doc: any) => doc.id !== id)
      if (isDuplicate) {
        return Response.json(
          {
            success: false,
            message: 'มีตัวแปรนี้อยู่แล้ว',
          },
          { status: 409 },
        )
      }
    }

    const updatedVariant = await req.payload.update({
      collection: 'variants',
      id: id,
      data: { variantName, variantCode },
    })
    return Response.json(
      { success: true, message: 'แก้ไขข้อมูลตัวแปรเรียบร้อยแล้ว', data: updatedVariant },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขข้อมูลตัวแปรได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}

export const deleteVariant = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบข้อมูลตัวแปรได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรุณาระบุ ID ตัวแปร',
        },
        {
          status: 400,
        },
      )
    }

    const variant = await req.payload.findByID({
      collection: 'variants',
      id: id,
    })
    if (!variant) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบตัวแปรที่ระบุ',
        },
        {
          status: 404,
        },
      )
    }

    const deletedVariant = await req.payload.delete({
      collection: 'variants',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบข้อมูลตัวแปรเรียบร้อยแล้ว', data: deletedVariant },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบข้อมูลตัวแปรได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}
