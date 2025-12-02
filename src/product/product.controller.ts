import { CreateProductValidator, UpdateProductValidator } from './product.validator'

export const createProduct = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถสร้างสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const productData = await req.json()
    const { productName, productCode, price, stock, status, model, variant } =
      productData as CreateProductValidator

    // Validate model exists
    const modelData = await req.payload.findByID({
      collection: 'models',
      id: model,
    })
    if (!modelData) {
      return Response.json({ success: false, message: 'ไม่พบโมเดลที่ระบุ' }, { status: 404 })
    }

    // ❗ Check duplicate variant IDs
    const uniqueVariantIDs = new Set(variant)
    if (uniqueVariantIDs.size !== variant.length) {
      return Response.json(
        { success: false, message: 'ไม่สามารถเลือกตัวแปรที่ซ้ำกัน' },
        { status: 400 },
      )
    }

    // Load variants
    const variantResults = await Promise.all(
      variant.map((variantId: string) =>
        req.payload.findByID({
          collection: 'variants',
          id: variantId,
        }),
      ),
    )

    // ❗ If some variant does not exist
    if (variantResults.some((v) => !v)) {
      return Response.json({ success: false, message: 'ไม่พบตัวแปรบางตัวที่ระบุ' }, { status: 404 })
    }

    // Extract variantCodes
    const variantCodes = variantResults.map((v: any) => v.variantCode)

    // ❗ Check duplicate variantCode
    const uniqueVariantCodes = new Set(variantCodes)
    if (uniqueVariantCodes.size !== variantCodes.length) {
      return Response.json(
        { success: false, message: 'ไม่สามารถเลือกตัวแปรที่มีรหัสเดียวกัน' },
        { status: 400 },
      )
    }

    // Check if productCode exists
    const existingProduct = await req.payload.find({
      collection: 'products',
      where: {
        productCode: { equals: productCode },
      },
    })

    if (existingProduct.docs && existingProduct.docs.length > 0) {
      return Response.json(
        { success: false, message: 'มีสินค้าที่มีรหัสนี้อยู่แล้ว' },
        { status: 409 },
      )
    }

    // Create product
    const newProduct = await req.payload.create({
      collection: 'products',
      data: {
        productName,
        productCode,
        price,
        stock,
        status: status || 'active',
        model,
        variant,
      },
    })

    return Response.json(
      { success: true, message: 'สร้างสินค้าเรียบร้อยแล้ว', data: newProduct },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
export const getAllProducts = async (req: any) => {
  try {
    // Query parameters
    const {
      page = 1, // หน้าเริ่มต้น
      limit = 10, // จำนวนต่อหน้า
      search, // ค้นหาจากชื่อหรือรหัสสินค้า
      status, // กรองตามสถานะ เช่น "active" หรือ "inactive"
      model, // กรองตาม model ID
    } = req.query

    // ---------------------------
    // Build the "where" filter
    // ---------------------------
    const where: any = {}

    // Search by productName or productCode
    if (search) {
      where.or = [
        { productName: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filter by status
    if (status) {
      where.status = { equals: status }
    }

    // Filter by model
    if (model) {
      where.model = { equals: model }
    }

    // ---------------------------
    // Query PayloadCMS
    // ---------------------------
    const products = await req.payload.find({
      collection: 'products',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: '-createdAt',
    })

    if (!products || products.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบสินค้า' }, { status: 404 })
    }

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลสินค้าสำเร็จ',
        data: products.docs,
        total: products.totalDocs,
        page: products.page,
        totalPages: products.totalPages,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getProductById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรุณาระบุ ID สินค้า' }, { status: 400 })
    }
    const product = await req.payload.findByID({
      collection: 'products',
      id: id,
    })
    if (!product) {
      return Response.json({ success: false, message: 'ไม่พบสินค้าที่ระบุ' }, { status: 404 })
    }
    return Response.json(
      { success: true, message: 'ดึงข้อมูลสินค้าสำเร็จ', data: product },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateProduct = async (req: any) => {
  try {
    // Check permission
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไขสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรุณาระบุ ID สินค้า' }, { status: 400 })
    }

    const updateData = await req.json()
    const { productName, productCode, price, stock, status, model, variant } = updateData

    // ---------------------------
    // VALIDATE MODEL
    // ---------------------------
    if (model) {
      const modelData = await req.payload.findByID({
        collection: 'models',
        id: model,
      })
      if (!modelData) {
        return Response.json({ success: false, message: 'ไม่พบโมเดลที่ระบุ' }, { status: 404 })
      }
    }

    // ---------------------------
    // PROCESS VARIANTS
    // ---------------------------
    let finalVariantIDs: string[] | undefined = undefined

    if (variant && Array.isArray(variant) && variant.length > 0) {
      // 1) ตรวจว่า variant id ซ้ำกันเองไหม
      const uniqueVariantIds = new Set(variant)
      if (uniqueVariantIds.size !== variant.length) {
        return Response.json(
          { success: false, message: 'ไม่สามารถเลือกตัวแปรที่ซ้ำกัน' },
          { status: 400 },
        )
      }

      // 2) โหลด variant ใหม่
      const newVariantResults = await Promise.all(
        variant.map((variantId: string) =>
          req.payload.findByID({
            collection: 'variants',
            id: variantId,
          }),
        ),
      )

      if (newVariantResults.some((v) => !v)) {
        return Response.json(
          { success: false, message: 'ไม่พบตัวแปรบางตัวที่ระบุ' },
          { status: 404 },
        )
      }

      // 3) โหลดสินค้าปัจจุบัน
      const product = await req.payload.findByID({
        collection: 'products',
        id,
      })

      // ⚠️ IMPORTANT: Normalize variant เก่า → ให้เหลือแค่ id
      const oldVariants = Array.isArray(product.variant)
        ? product.variant.map((v: any) => (typeof v === 'string' ? v : v.id))
        : []

      // 4) โหลด variant เก่า
      const oldVariantResults = await Promise.all(
        oldVariants.map((oldId: string) =>
          req.payload.findByID({
            collection: 'variants',
            id: oldId,
          }),
        ),
      )

      // 5) รวมเก่า + ใหม่
      const variantByCode = new Map<string, any>()

      // ใส่เก่าเข้าไปก่อน
      for (const v of oldVariantResults.filter(Boolean)) {
        variantByCode.set(v.variantCode, v)
      }

      // ใส่ใหม่ทับเก่า
      for (const v of newVariantResults) {
        variantByCode.set(v.variantCode, v)
      }

      // 6) เก็บเฉพาะ id ที่ normalize แล้ว
      finalVariantIDs = [...variantByCode.values()].map((v: any) => v.id)
    }

    // ---------------------------
    // VALIDATE PRODUCT CODE
    // ---------------------------
    if (productCode) {
      const existingProduct = await req.payload.find({
        collection: 'products',
        where: {
          productCode: {
            equals: productCode,
          },
        },
      })

      if (existingProduct.docs && existingProduct.docs.length > 0) {
        const isDuplicate = existingProduct.docs.some((doc: any) => doc.id !== id)
        if (isDuplicate) {
          return Response.json(
            { success: false, message: 'มีสินค้าที่มีรหัสนี้อยู่แล้ว' },
            { status: 409 },
          )
        }
      }
    }

    // ---------------------------
    // UPDATE PRODUCT
    // ---------------------------
    const updatedProduct = await req.payload.update({
      collection: 'products',
      id,
      data: {
        ...(productName && { productName }),
        ...(productCode && { productCode }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(status && { status }),
        ...(model && { model }),
        ...(finalVariantIDs && { variant: finalVariantIDs }),
      },
    })

    return Response.json(
      { success: true, message: 'แก้ไขสินค้าเรียบร้อยแล้ว', data: updatedProduct },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const deleteProduct = async (req: any) => {
  try {
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบสินค้าได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรุณาระบุ ID สินค้า' }, { status: 400 })
    }

    const product = await req.payload.findByID({
      collection: 'products',
      id: id,
    })
    if (!product) {
      return Response.json({ success: false, message: 'ไม่พบสินค้าที่ระบุ' }, { status: 404 })
    }

    const deletedProduct = await req.payload.delete({
      collection: 'products',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบสินค้าเรียบร้อยแล้ว', data: deletedProduct },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบสินค้าได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
