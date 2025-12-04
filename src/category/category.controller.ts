import { CreateCategoryValidator, UpdateCategoryValidator } from './category.validator'

export const createCategory = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถสร้างหมวดหมู่ได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const categoryData = await req.json()
    const { categoryName, categoryCode } = categoryData as CreateCategoryValidator

    const existingCategory = await req.payload.find({
      collection: 'categories',
      where: {
        categoryCode: {
          equals: categoryCode,
        },
      },
    })
    if (existingCategory.docs && existingCategory.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีหมวดหมู่สินค้านี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }
    const newCategory = await req.payload.create({
      collection: 'categories',
      data: {
        categoryName,
        categoryCode,
      },
    })
    return Response.json(
      {
        success: true,
        message: 'สร้างหมวดหมู่สินค้าเรียบร้อยแล้ว',
        data: newCategory,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        seccess: false,
        message: 'ไม่สามารถสร้างหมวดหมู่ได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllCategories = async (req: any) => {
  try {
    const { page, limit, search, type, sortBy } = req.query

    const where: any = {}

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (type) {
      where.type = { equals: type }
    }

    const categories = await req.payload.find({
      collection: 'categories',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
      depth: 1, // ดึง type มาด้วย
    })

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลหมวดหมู่สินค้าสำเร็จ',
        data: categories.docs,
        pagination: {
          total: categories.totalDocs,
          page: categories.page,
          limit: Number(limit),
          totalPages: categories.totalPages,
          hasNextPage: categories.hasNextPage,
          hasPrevPage: categories.hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลหมวดหมู่สินค้าได้',
      },
      { status: 500 },
    )
  }
}

export const getCategoryById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID หมวดหมู่สินค้า',
        },
        { status: 400 },
      )
    }

    const category = await req.payload.findByID({
      collection: 'categories',
      id: id,
    })
    if (!category || category.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบหมวดหมู่สินค้าที่ระบุ',
        },
        { status: 404 },
      )
    }
    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลหมวดหมู่สินค้าสำเร็จ',
        data: category,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลหมวดหมู่สินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateCategory = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไชข้อมูลหมวดหมู่ได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID หมวดหมู่สินค้า',
        },
        { status: 400 },
      )
    }
    const category = await req.payload.findByID({
      collection: 'categories',
      id: id,
    })
    if (!category || category.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบหมวดหมู่สินค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const categoryData = await req.json()
    const { categoryName, categoryCode } = categoryData as UpdateCategoryValidator

    const existingCategory = await req.payload.find({
      collection: 'categories',
      where: {
        or: [
          {
            categoryName: {
              equals: categoryName,
            },
          },
          {
            categoryCode: {
              equals: categoryCode,
            },
          },
        ],
        not: id,
      },
    })
    if (existingCategory.docs && existingCategory.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีหมวดหมู่สินค้านี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }
    const updatedCategory = await req.payload.update({
      collection: 'categories',
      id: id,
      data: {
        categoryName,
        categoryCode,
      },
    })
    return Response.json(
      {
        success: true,
        message: 'แก้ไชข้อมูลหมวดหมู่สินค้าเรียบร้อยแล้ว',
        data: updatedCategory,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไชข้อมูลหมวดหมู่สินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const deleteCategory = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไชข้อมูลหมวดหมู่ได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        { success: false, message: 'กรณาระบุ ID หมวดหมู่สินค้า' },
        { status: 400 },
      )
    }
    const category = await req.payload.findByID({
      collection: 'categories',
      id: id,
    })
    if (!category || category.totalDocs === 0) {
      return Response.json(
        { success: false, message: 'ไม่พบหมวดหมู่สินค้าที่ระบุ' },
        { status: 404 },
      )
    }
    const deletedCategory = await req.payload.delete({
      collection: 'categories',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบหมวดหมู่สินค้าเรียบร้อยแล้ว', data: deletedCategory },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบหมวดหมู่สินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
