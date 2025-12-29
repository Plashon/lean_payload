import { success } from 'zod'
import { CreateContectValidator } from './contect.validator'

export const submitContactRequest = async (req: any) => {
  try {
    const data = await req.json()
    const { fullName, email, company, jobTitle, interestedProducts, message } =
      data as CreateContectValidator

    const { agreedToTerms } = data

    if (!agreedToTerms) {
      return Response.json({
        success: false,
        message: 'คุณต้องยอมรับข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว',
      })
    }
    const newContect = await req.payload.create({
      collection: 'contact-requests',
      data: {
        fullName,
        email,
        company,
        jobTitle,
        interestedProducts,
        message,
      },
    })
    return Response.json({
      success: true,
      message: 'ส่งข้อมูลสำเร็จ',
      data: newContect,
    })
  } catch (error) {
    return Response.json({
      success: false,
      message: 'ไม่สามารถส่งข้อมูลได้',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const getContactRequests = async (req: any) => {
  try {
    const { page, limit, search, sortBy, depth, email, company } = req.query
    const where: any = {}

    if (search) {
      where.or = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ]
    }
    if (email) {
      where.email = { equals: email }
    }
    if (company) {
      where.company = { contains: company }
    }
    const contactRequests = await req.payload.find({
      collection: 'contact-requests',
      where,
      page: Number(page),
      limit: Number(limit),
      sort: sortBy,
      depth,
    })

    return Response.json({
      success: true,
      message: 'ดึงข้อมูลสำเร็จ',
      data: contactRequests.docs,
      pagination: {
        totalDocs: contactRequests.totalDocs,
        totalPages: contactRequests.totalPages,
        page: contactRequests.page,
        limit: Number(limit),
        hasNextPage: contactRequests.hasNextPage,
        hasPrevPage: contactRequests.hasPrevPage,
      },
    })
  } catch (error) {
    return Response.json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลได้',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const getContactRequestById = async (req: any) => {
  try {
    const { id } = req.routeParams

    const contactRequest = await req.payload.findByID({
      collection: 'contact-requests',
      id,
    })

    return Response.json({
      success: true,
      message: 'ดึงข้อมูลสำเร็จ',
      data: contactRequest,
    })
  } catch (error) {
    return Response.json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลได้',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
