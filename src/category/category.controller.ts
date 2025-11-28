import { Payload } from 'payload'
import CategoryValidator, {
  CreateCategoryValidator,
  UpdateCategoryValidator,
} from './category.validator'
import { success, ZodError } from 'zod'
import { ca } from 'zod/locales'

/**
 * Handle validation errors and return formatted response
 */
const handleValidationError = (error: ZodError) => {
  const formattedErrors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  return {
    status: 400,
    body: {
      success: false,
      message: 'การตรวจสอบล้มเหลว',
      errors: formattedErrors,
    },
  }
}

export const getAllCategories = async (payload: Payload) => {
  try {
    const categories = await payload.find({
      collection: 'categories',
    })
    return {
      status: 200,
      body: {
        success: true,
        data: categories,
      },
    }
  } catch (error) {
    // console.error('Error fetching categories:', error)
    return {
      status: 500,
      body: {
        success: false,
        message: 'ผิดพลาดในการดึงข้อมูลประเภทสินค้า',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export const getCategoryById = async (payload: Payload, id: string) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'จำเป็นต้องมีรหัสประเภทสินค้า',
        },
      }
    }
    const category = await payload.findByID({
      collection: 'categories',
      id,
    })
    if (!category) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'ไม่พบประเภทสินค้าที่ระบุ',
        },
      }
    }
    return {
      status: 200,
      body: {
        success: true,
        data: category,
      },
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'ผิดพลาดในการดึงข้อมูลประเภทสินค้าตามรหัส',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export const createCategory = async (payload: Payload, data: CreateCategoryValidator) => {
  try {
    const validatedData = CategoryValidator.CreateCategory.parse(data)
    if (!validatedData) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'ข้อมูลประเภทสินค้าไม่ถูกต้อง',
        },
      }
    }
    const existingCategory = await payload.find({
      collection: 'categories',
      where: {
        categoryCode: {
          equals: validatedData.categoryCode,
        },
      },
    })
    if (existingCategory.totalDocs > 0) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'รหัสของประเภทสินค้านี้มีอยู่ในระบบแล้ว',
        },
      }
    }

    const newCategory = await payload.create({
      collection: 'categories',
      data: validatedData,
    })

    return {
      status: 201,
      body: {
        success: true,
        data: newCategory,
      },
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'ผิดพลาดในการสร้างประเภทสินค้า',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export const updateCategory = async (
  payload: Payload,
  id: string,
  data: UpdateCategoryValidator,
) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'จำเป็นต้องมีรหัสประเภทสินค้า',
        },
      }
    }
    const validatedData = CategoryValidator.UpdateCategory.parse(data)
    if (!validatedData) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'ข้อมูลประเภทสินค้าไม่ถูกต้อง',
        },
      }
    }

    const existingCategory = await payload.findByID({
      collection: 'categories',
      id,
    })
    if (!existingCategory) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'ไม่พบประเภทสินค้าที่ต้องการอัปเดต',
        },
      }
    }

    const existingCodeOrName = await payload.find({
      collection: 'categories',
      where: {
        or: [
          { categoryCode: { equals: validatedData.categoryCode } },
          { categoryName: { equals: validatedData.categoryName } },
        ],
        // อย่าลืม exclude id เดิมของ category ที่กำลังอัปเดต
        id: { not_equals: id },
      },
    })

    if (existingCodeOrName.totalDocs > 0) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'รหัสหรือชื่อประเภทสินค้านี้มีอยู่ในระบบแล้ว',
          data: existingCodeOrName.docs, // ส่งข้อมูลซ้ำกลับไปด้วยก็ได้
        },
      }
    }

    const hasChanges = Object.keys(validatedData).some((key) => {
      return (validatedData as any)[key] !== (existingCategory as any)[key]
    })
    if (!hasChanges) {
      return {
        status: 200,
        body: {
          success: true,
          message: 'ไม่มีการเปลี่ยนแปลงข้อมูล',
          data: existingCategory,
        },
      }
    }

    const updatedCategory = await payload.update({
      collection: 'categories',
      id,
      data: validatedData,
    })
    return {
      status: 200,
      body: {
        success: true,
        message: 'อัปเดตช้อมูลประเภทสินค้าสำเร็จ',
        data: updatedCategory,
      },
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'ผิดพลาดในการอัปเดตประเภทสินค้า',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export const deleteCategory = async (payload: Payload, id: string) => {
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'จำเป็นต้องมีรหัสประเภทสินค้า',
        },
      }
    }
    await payload.delete({
      collection: 'categories',
      id,
    })

    return {
      status: 200,
      body: {
        success: true,
        message: 'ลบประเภทสินค้าสำเร็จ',
      },
    }
  } catch (error) {
    return {
      status: 500,
      message: 'ผิดพลาดในการลบประเภทสินค้า',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
