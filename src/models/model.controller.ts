import { CreateModelValidator, UpdateModelValidator } from './model.validator'

export const createModel = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถสร้างโมเดลสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const modelData = await req.json()
    const { modelName, modelCode, type } = modelData as CreateModelValidator
    const existingModel = await req.payload.find({
      collection: 'models',
      where: {
        or: [
          {
            modelName: {
              equals: modelName,
            },
          },
          {
            modelCode: {
              equals: modelCode,
            },
          },
        ],
      },
    })
    if (existingModel.docs && existingModel.docs.length > 0) {
      return Response.json({ success: false, message: 'มีโมเดลสินค้านี้อยู่แล้ว' }, { status: 409 })
    }

    const typeData = await req.payload.findByID({
      collection: 'types',
      id: type,
    })

    if (!typeData) {
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
    const newModel = await req.payload.create({
      collection: 'models',
      data: { modelName, modelCode, type: typeData.id },
    })
    return Response.json(
      { success: true, message: 'สร้างโมเดลสินค้าเรียบร้อยแล้ว', data: newModel },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างโมเดลสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllModels = async (req: any) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category, // filter by category
      sortBy = '-createdAt',
    } = req.query

    const where: any = {}

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (category) {
      where.category = { equals: category }
    }

    const models = await req.payload.find({
      collection: 'models',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
      depth: 1, // ดึง category มาด้วย
    })

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลโมเดลสินค้าสำเร็จ',
        data: models.docs,
        pagination: {
          total: models.totalDocs,
          page: models.page,
          limit: Number(limit),
          totalPages: models.totalPages,
          hasNextPage: models.hasNextPage,
          hasPrevPage: models.hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลโมเดลสินค้าได้',
      },
      { status: 500 },
    )
  }
}

export const getModelById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรณาระบุ ID โมเดลสินค้า' }, { status: 400 })
    }
    const model = await req.payload.findByID({
      collection: 'models',
      id: id,
    })
    if (!model || model.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบโมเดลสินค้าที่ระบุ' }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: 'ดึงข้อมูลโมเดลสินค้าสำเร็จ',
      data: model,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลโมเดลสินค้าได้',
      },
      { status: 500 },
    )
  }
}

export const updateModel = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไขโมเดลสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID โมเดลสินค้า',
        },
        { status: 400 },
      )
    }
    const updateData = await req.json()
    const { modelName, modelCode, type } = updateData as UpdateModelValidator

    const typeData = await req.payload.findByID({
      collection: 'types',
      id: type,
    })
    if (!typeData) {
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
    const existingModel = await req.payload.find({
      collection: 'models',
      where: {
        or: [
          {
            modelName: {
              equals: modelName,
            },
          },
          {
            modelCode: {
              equals: modelCode,
            },
          },
        ],
        not: id,
      },
    })
    if (existingModel.docs && existingModel.docs.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'มีโมเดลสินค้านี้อยู่แล้ว',
        },
        { status: 409 },
      )
    }
    const updatedModel = await req.payload.update(
      {
        collection: 'models',
        id: id,
        data: { modelName, modelCode, type: typeData.id },
      },
      {
        status: 200,
      },
    )
    return Response.json(
      { success: true, message: 'แก้ไขข้อมูลโมเดลสินค้าเรียบร้อยแล้ว', data: updatedModel },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขข้อมูลโมเดลสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}

export const deleteModel = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบข้อมูลโมเดลสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID โมเดลสินค้า',
        },
        { status: 400 },
      )
    }

    const model = await req.payload.findByID({
      collection: 'models',
      id: id,
    })
    if (!model || model.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบโมเดลสินค้าที่ระบุ',
        },
        { status: 404 },
      )
    }

    const deletedModel = await req.payload.delete({
      collection: 'models',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบข้อมูลโมเดลสินค้าเรียบร้อยแล้ว', data: deletedModel },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบข้อมูลโมเดลสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}
