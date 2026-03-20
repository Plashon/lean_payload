import MediaValidator from './media.validator'

export const createMedia = async (req: any) => {
  try {
    // ตรวจสอบสิทธิ์
    if (req.user?.collection !== 'admins') {
      return Response.json({ success: false, message: 'ไม่มีสิทธิ์อัพโหลดไฟล์' }, { status: 403 })
    }

    // Parse FormData จาก Web Standard Request
    const formData = await req.formData()

    const file = formData.get('file') as File | null
    const alt = formData.get('alt') as string
    const product = formData.get('product') as string

    // Validate ด้วย Zod
    const parsed = MediaValidator.CreateMedia.safeParse({
      alt,
      product,
    })

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      )
    }

    // ตรวจสอบว่ามีไฟล์หรือไม่
    if (!file || !(file instanceof File)) {
      return Response.json({ success: false, message: 'ต้องมีไฟล์อัพโหลด' }, { status: 400 })
    }

    // ตรวจสอบ MIME type
    const allowedMime = ['image/jpeg', 'image/png']
    if (!allowedMime.includes(file.type)) {
      return Response.json(
        { success: false, message: 'รองรับเฉพาะไฟล์ JPG และ PNG' },
        { status: 400 },
      )
    }

    // แปลง File เป็น Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // สร้าง media document ใน PayloadCMS
    const media = await req.payload.create({
      collection: 'media',
      data: {
        alt: parsed.data.alt,
        product: parsed.data.product,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    return Response.json(
      { success: true, message: 'อัพโหลดไฟล์สำเร็จ', data: media },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    return Response.json(
      {
        success: false,
        message: 'อัพโหลดล้มเหลว',
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export const getAllMedia = async (req: any) => {
  try {
    const { page, limit, search, sortBy, product } = req.query

    const where: any = {}

    if (search) {
      where.alt = { contains: search, mode: 'insensitive' }
    }

    // กรองตาม product
    if (product) {
      where.product = { equals: product }
    }

    const media = await req.payload.find({
      collection: 'media',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
      depth: 1, // ดึงข้อมูล product มาด้วย
    })

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลสำเร็จ',
        data: media.docs,
        total: media.totalDocs,
        page: media.page,
        totalPages: media.totalPages,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, message: 'ดึงข้อมูลล้มเหลว' }, { status: 500 })
  }
}

export const getMediaById = async (req: any) => {
  try {
    const { id } = req.routeParams

    const media = await req.payload.findByID({
      collection: 'media',
      id,
      depth: 1, // ดึงข้อมูล product มาด้วย
    })

    return Response.json({ success: true, message: 'สำเร็จ', data: media }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, message: 'ไม่พบไฟล์ภาพ' }, { status: 404 })
  }
}

export const updateMedia = async (req: any) => {
  try {
    const { id } = req.routeParams

    // Parse FormData
    const formData = await req.formData()

    const file = formData.get('file') as File | null
    const alt = formData.get('alt') as string
    const product = formData.get('product') as string

    // Validate
    const parsed = MediaValidator.UpdateMedia.safeParse({
      alt,
      product,
    })

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      )
    }

    const updateData: any = {}
    if (parsed.data.alt) updateData.alt = parsed.data.alt
    if (parsed.data.product) updateData.product = parsed.data.product

    let updatePayload: any = {
      collection: 'media',
      id,
      data: updateData,
    }

    // ถ้ามีการอัพโหลดไฟล์ใหม่
    if (file && file instanceof File) {
      const allowedMime = ['image/jpeg', 'image/png']
      if (!allowedMime.includes(file.type)) {
        return Response.json(
          { success: false, message: 'รองรับเฉพาะไฟล์ JPG และ PNG' },
          { status: 400 },
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      updatePayload.file = {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      }
    }

    const updated = await req.payload.update(updatePayload)

    return Response.json({ success: true, message: 'อัพเดทสำเร็จ', data: updated }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return Response.json(
      { success: false, message: 'อัพเดทล้มเหลว', error: error.message },
      { status: 500 },
    )
  }
}

export const deleteMedia = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        { success: false, message: 'กรุณาระบุ id ของไฟล์ที่ต้องการลบ' },
        { status: 404 },
      )
    }
    await req.payload.delete({
      collection: 'media',
      id,
    })

    return Response.json({ success: true, message: 'ลบไฟล์สำเร็จ' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, message: 'ลบไฟล์ล้มเหลว' }, { status: 500 })
  }
}
