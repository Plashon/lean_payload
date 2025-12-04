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
    const { page, limit, search, sortBy } = req.query

    const where: any = {}

    if (search) {
      where.or = [
        { variantName: { contains: search, mode: 'insensitive' } },
        { variantCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    const variants = await req.payload.find({
      collection: 'variants',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
    })

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลตัวแปรสำเร็จ',
        data: variants.docs,
        pagination: {
          total: variants.totalDocs,
          page: variants.page,
          limit: Number(limit),
          totalPages: variants.totalPages,
          hasNextPage: variants.hasNextPage,
          hasPrevPage: variants.hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
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
