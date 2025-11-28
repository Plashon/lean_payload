import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './category.controller'
import { da } from 'zod/locales'

export const getAllCategoriesRoute = async (request: Request) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const result = await getAllCategories(payload)
    return Response.json(result.body, { status: result.status })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'เซิร์ฟเวอร์ภายในมีข้อผิดพลาด',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const createCategoryRoute = async (request: Request) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const data = await request.json()
    const result = await createCategory(payload, data)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'เซิร์ฟเวอร์ภายในมีข้อผิดพลาด',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getCategoryByIdRoute = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const { id } = params
    const result = await getCategoryById(payload, id)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'เซิร์ฟเวอร์ภายในมีข้อผิดพลาด',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateCategoryRoute = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const id = params?.id
    if (!id) {
      return Response.json(
        { success: false, message: 'จำเป็นต้องมี id ของ category' },
        { status: 400 },
      )
    }
    const data = await request.json()
    const result = await updateCategory(payload, id, data)

    return Response.json(result.body, { status: result.status })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'เซิร์ฟเวอร์ภายในมีข้อผิดพลาด',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const deleteCategoryRoute = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const { id } = params
    const result = await deleteCategory(payload, id)
    return Response.json(result.body, { status: result.status })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'เซิร์ฟเวอร์ภายในมีข้อผิดพลาด',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
