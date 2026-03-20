import { success } from 'zod'
import { CreateBlogValidator, UpdateBlogValidator } from './blog.validator'

export const createBlog = async (req: any) => {
  try {
    const blogData = await req.json()
    const { blog, summary, type } = blogData as CreateBlogValidator

    const newBlog = await req.payload.create({
      collection: 'blog',
      data: { blog, summary, type },
    })

    return Response.json(
      {
        success: true,
        message: 'สร้างบทความสำเร็จ',
        data: newBlog,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างบทความได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllBlogs = async (req: any) => {
  try {
    const { page, limit, search, type, sortBy } = req.query

    const where: any = {}

    const blogs = await req.payload.find({
      collection: 'blog',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
    })

    return Response.json({
      success: true,
      message: 'ดึงข้อมูลบทความสำเร็จ',
      data: blogs.docs,
      pagination: {
        total: blogs.totalDocs,
        page: blogs.page,
        limit: Number(limit),
        totalPages: blogs.totalPages,
        hasNextPage: blogs.hasNextPage,
        hasPrevPage: blogs.hasPrevPage,
      },
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลบทความได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getBlogById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json({ success: false, message: 'กรณาระบุ ID บทความ' }, { status: 400 })
    }
    const blog = await req.payload.findByID({
      collection: 'blog',
      id: id,
    })
    if (!blog || blog.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบบทความที่ระบุ' }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: 'ดึงข้อมูลบทความสำเร็จ',
      data: blog,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลบทความได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateBlog = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID บทความ',
        },
        { status: 400 },
      )
    }
    const updateData = await req.json()
    const { blog, summary, type } = updateData as UpdateBlogValidator
    const updatedBlog = await req.payload.update(
      {
        collection: 'blog',
        id: id,
        data: { blog, summary, type },
      },
      {
        status: 200,
      },
    )

    return Response.json(
      { success: true, message: 'แก้ไขข้อมูลบทความสำเร็จ', data: updatedBlog },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขข้อมูลบทความได้',
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    )
  }
}

export const deleteBlog = async (req: any) => {
  try {
    const { id } = req.routeParams

    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'กรณาระบุ ID บทความ',
        },
        { status: 400 },
      )
    }
    const blog = await req.payload.findByID({
      collection: 'blog',
      id: id,
    })
    if (!blog || blog.totalDocs === 0) {
      return Response.json(
        {
          success: false,
          message: 'ไม่พบบทความที่ระบุ',
        },
        { status: 404 },
      )
    }
    const deletedBlog = await req.payload.delete({
      collection: 'blog',
      id: id,
    })
    return Response.json(
      { success: true, message: 'ลบข้อมูลบทความสำเร็จ', data: deletedBlog },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบข้อมูลบทความได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
