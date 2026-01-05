import { CreateOrderValidator, UpdateOrderValidator } from './order.validator'

export const createOrder = async (req: any) => {
  try {
    const orderData = await req.json()
    const {
      orderNumber,
      customer,
      status,
      statusTimeline,
      estimatedDelivery,
      items,
      pricing,
      tracking,
      shippingAddress,
      addressIndex,
      billingAddress,
      sameAsShipping,
      shippingMethod,
      shippingFee,
      discount,
    } = orderData as CreateOrderValidator

    // Validate customer exists
    const customerData = await req.payload.findByID({
      collection: 'customers',
      id: customer,
    })
    if (!customerData) {
      return Response.json(
        { success: false, message: 'ไม่พบลูกค้าที่ระบุ' },
        { status: 404 },
      )
    }

    // Get shipping address from customer data
    let finalShippingAddress = shippingAddress
    if (!finalShippingAddress) {
      // Get address from customer addresses array
      const customerAddresses = customerData.addresses || []
      
      if (customerAddresses.length === 0) {
        return Response.json(
          { success: false, message: 'ลูกค้าไม่มีที่อยู่ กรุณาเพิ่มที่อยู่ก่อน' },
          { status: 400 },
        )
      }

      // Use addressIndex if provided, otherwise use default address, otherwise use first address
      let selectedAddress
      if (addressIndex !== undefined && addressIndex >= 0 && addressIndex < customerAddresses.length) {
        selectedAddress = customerAddresses[addressIndex]
      } else {
        selectedAddress = customerAddresses.find((addr: any) => addr.isDefault) || customerAddresses[0]
      }

      if (!selectedAddress) {
        return Response.json(
          { success: false, message: 'ไม่พบที่อยู่ที่เลือก' },
          { status: 400 },
        )
      }

      // Map customer address to shippingAddress format
      finalShippingAddress = {
        recipientName: customerData.name || '',
        companyName: '',
        address: selectedAddress.address || '',
        subDistrict: selectedAddress.subDistrict || '',
        district: selectedAddress.district || '',
        province: selectedAddress.province || '',
        postalCode: selectedAddress.postalCode || '',
        phone: customerData.phone || '',
      }
    }

    // Validate orderNumber uniqueness
    const existingOrder = await req.payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: orderNumber },
      },
    })

    if (existingOrder.docs && existingOrder.docs.length > 0) {
      return Response.json(
        { success: false, message: 'มีคำสั่งซื้อที่มีหมายเลขนี้อยู่แล้ว' },
        { status: 409 },
      )
    }

    // Validate all products exist and get product data for pricing calculation
    const productIds = items.map((item) => item.product)
    const productResults = await Promise.all(
      productIds.map((productId: string) =>
        req.payload.findByID({
          collection: 'products',
          id: productId,
        }),
      ),
    )

    if (productResults.some((p) => !p)) {
      return Response.json(
        { success: false, message: 'ไม่พบสินค้าบางรายการที่ระบุ' },
        { status: 404 },
      )
    }

    // Calculate pricing from products
    let calculatedPricing = pricing
    if (!calculatedPricing) {
      let subtotal = 0
      
      items.forEach((item, index) => {
        const product = productResults[index]
        const quantity = item.quantity || 1
        if (product && product.price) {
          subtotal += product.price * quantity
        }
      })

      const finalShippingFee = shippingFee || 0
      const finalDiscount = discount || 0
      const total = subtotal + finalShippingFee - finalDiscount

      calculatedPricing = {
        subtotal,
        shipping: finalShippingFee,
        discount: finalDiscount,
        total: Math.max(0, total), // Ensure total is not negative
      }
    }

    // Handle billing address
    let finalBillingAddress = billingAddress
    if (sameAsShipping !== false && !finalBillingAddress) {
      // If sameAsShipping is true (default), copy shipping address to billing address
      finalBillingAddress = {
        sameAsShipping: true,
        recipientName: finalShippingAddress.recipientName,
        companyName: finalShippingAddress.companyName,
        address: finalShippingAddress.address,
        subDistrict: finalShippingAddress.subDistrict,
        district: finalShippingAddress.district,
        province: finalShippingAddress.province,
        postalCode: finalShippingAddress.postalCode,
        phone: finalShippingAddress.phone,
      }
    } else if (finalBillingAddress) {
      finalBillingAddress.sameAsShipping = sameAsShipping !== false
    }

    // Create order
    const newOrder = await req.payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer,
        status: status || 'to_pay',
        statusTimeline,
        estimatedDelivery,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity || 1,
        })),
        pricing: calculatedPricing,
        tracking,
        shippingAddress: finalShippingAddress,
        billingAddress: finalBillingAddress,
        shippingMethod: shippingMethod || 'standard',
      },
    })

    return Response.json(
      { success: true, message: 'สร้างคำสั่งซื้อเรียบร้อยแล้ว', data: newOrder },
      { status: 201 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถสร้างคำสั่งซื้อได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getAllOrders = async (req: any) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy,
      status,
      customer,
      orderNumber,
    } = req.query

    const where: any = {}

    // Search by orderNumber
    if (search) {
      where.orderNumber = { contains: search, mode: 'insensitive' }
    }

    // Filter by status
    if (status) {
      where.status = { equals: status }
    }

    // Filter by customer
    if (customer) {
      where.customer = { equals: customer }
    }

    // Filter by orderNumber
    if (orderNumber) {
      where.orderNumber = { equals: orderNumber }
    }

    const orders = await req.payload.find({
      collection: 'orders',
      where,
      limit: Number(limit),
      page: Number(page),
      sort: sortBy,
    })

    if (!orders || orders.totalDocs === 0) {
      return Response.json({ success: false, message: 'ไม่พบคำสั่งซื้อ' }, { status: 404 })
    }

    return Response.json(
      {
        success: true,
        message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ',
        data: orders.docs,
        total: orders.totalDocs,
        page: orders.page,
        totalPages: orders.totalPages,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const getOrderById = async (req: any) => {
  try {
    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        { success: false, message: 'กรุณาระบุ ID คำสั่งซื้อ' },
        { status: 400 },
      )
    }

    const order = await req.payload.findByID({
      collection: 'orders',
      id: id,
    })

    if (!order) {
      return Response.json(
        { success: false, message: 'ไม่พบคำสั่งซื้อที่ระบุ' },
        { status: 404 },
      )
    }

    return Response.json(
      { success: true, message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ', data: order },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const updateOrder = async (req: any) => {
  try {
    // Check permission - only admins can update orders
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถแก้ไขคำสั่งซื้อได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        { success: false, message: 'กรุณาระบุ ID คำสั่งซื้อ' },
        { status: 400 },
      )
    }

    const order = await req.payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return Response.json(
        { success: false, message: 'ไม่พบคำสั่งซื้อที่ระบุ' },
        { status: 404 },
      )
    }

    const updateData = await req.json()
    const {
      orderNumber,
      customer,
      status,
      statusTimeline,
      estimatedDelivery,
      items,
      pricing,
      tracking,
      shippingAddress,
      addressIndex,
      billingAddress,
      sameAsShipping,
      shippingMethod,
      shippingFee,
      discount,
    } = updateData as UpdateOrderValidator

    // Get customer data (either from update or existing order)
    let customerData: any = null
    const customerId = customer || order.customer
    if (customerId) {
      customerData = await req.payload.findByID({
        collection: 'customers',
        id: typeof customerId === 'string' ? customerId : customerId.id || customerId,
      })
      if (!customerData) {
        return Response.json(
          { success: false, message: 'ไม่พบลูกค้าที่ระบุ' },
          { status: 404 },
        )
      }
    }

    // Validate orderNumber uniqueness if provided
    if (orderNumber) {
      const existingOrder = await req.payload.find({
        collection: 'orders',
        where: {
          orderNumber: { equals: orderNumber },
        },
      })

      if (existingOrder.docs && existingOrder.docs.length > 0) {
        const isDuplicate = existingOrder.docs.some((doc: any) => doc.id !== id)
        if (isDuplicate) {
          return Response.json(
            { success: false, message: 'มีคำสั่งซื้อที่มีหมายเลขนี้อยู่แล้ว' },
            { status: 409 },
          )
        }
      }
    }

    // Handle shipping address - get from customer if not provided
    let finalShippingAddress = shippingAddress
    if (!finalShippingAddress && customerData) {
      const customerAddresses = customerData.addresses || []
      
      if (customerAddresses.length > 0) {
        let selectedAddress
        if (addressIndex !== undefined && addressIndex >= 0 && addressIndex < customerAddresses.length) {
          selectedAddress = customerAddresses[addressIndex]
        } else {
          selectedAddress = customerAddresses.find((addr: any) => addr.isDefault) || customerAddresses[0]
        }

        if (selectedAddress) {
          finalShippingAddress = {
            recipientName: customerData.name || order.shippingAddress?.recipientName || '',
            companyName: order.shippingAddress?.companyName || '',
            address: selectedAddress.address || '',
            subDistrict: selectedAddress.subDistrict || '',
            district: selectedAddress.district || '',
            province: selectedAddress.province || '',
            postalCode: selectedAddress.postalCode || '',
            phone: customerData.phone || order.shippingAddress?.phone || '',
          }
        }
      }
    }

    // Validate products if items are provided and calculate pricing
    let calculatedPricing = pricing
    if (items && Array.isArray(items) && items.length > 0) {
      const productIds = items.map((item) => item.product)
      const productResults = await Promise.all(
        productIds.map((productId: string) =>
          req.payload.findByID({
            collection: 'products',
            id: productId,
          }),
        ),
      )

      if (productResults.some((p) => !p)) {
        return Response.json(
          { success: false, message: 'ไม่พบสินค้าบางรายการที่ระบุ' },
          { status: 404 },
        )
      }

      // Recalculate pricing if items changed and pricing not explicitly provided
      if (!pricing) {
        let subtotal = 0
        
        items.forEach((item, index) => {
          const product = productResults[index]
          const quantity = item.quantity || 1
          if (product && product.price) {
            subtotal += product.price * quantity
          }
        })

        const finalShippingFee = shippingFee !== undefined ? shippingFee : (order.pricing?.shipping || 0)
        const finalDiscount = discount !== undefined ? discount : (order.pricing?.discount || 0)
        const total = subtotal + finalShippingFee - finalDiscount

        calculatedPricing = {
          subtotal,
          shipping: finalShippingFee,
          discount: finalDiscount,
          total: Math.max(0, total),
        }
      }
    } else if (!pricing && (shippingFee !== undefined || discount !== undefined)) {
      // Update pricing with new shipping/discount if items not changed
      // Recalculate subtotal from existing order items if available
      let subtotal = order.pricing?.subtotal || 0
      
      // If order has items with quantity, recalculate subtotal
      if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        const existingProductIds = order.items.map((item: any) => 
          typeof item.product === 'string' ? item.product : item.product?.id || item.product
        )
        
        if (existingProductIds.length > 0) {
          const existingProducts = await Promise.all(
            existingProductIds.map((productId: string) =>
              req.payload.findByID({
                collection: 'products',
                id: productId,
              }),
            ),
          )
          
          subtotal = 0
          order.items.forEach((item: any, index: number) => {
            const product = existingProducts[index]
            const quantity = item.quantity || 1
            if (product && product.price) {
              subtotal += product.price * quantity
            }
          })
        }
      }
      
      const finalShippingFee = shippingFee !== undefined ? shippingFee : (order.pricing?.shipping || 0)
      const finalDiscount = discount !== undefined ? discount : (order.pricing?.discount || 0)
      const total = subtotal + finalShippingFee - finalDiscount

      calculatedPricing = {
        subtotal,
        shipping: finalShippingFee,
        discount: finalDiscount,
        total: Math.max(0, total),
      }
    }

    // Handle billing address
    let finalBillingAddress = billingAddress
    if (sameAsShipping !== undefined && sameAsShipping && !finalBillingAddress && finalShippingAddress) {
      // If sameAsShipping is true, copy shipping address to billing address
      finalBillingAddress = {
        sameAsShipping: true,
        recipientName: finalShippingAddress.recipientName,
        companyName: finalShippingAddress.companyName,
        address: finalShippingAddress.address,
        subDistrict: finalShippingAddress.subDistrict,
        district: finalShippingAddress.district,
        province: finalShippingAddress.province,
        postalCode: finalShippingAddress.postalCode,
        phone: finalShippingAddress.phone,
      }
    } else if (finalBillingAddress && sameAsShipping !== undefined) {
      finalBillingAddress.sameAsShipping = sameAsShipping
    }

    // Update order
    const updatedOrder = await req.payload.update({
      collection: 'orders',
      id,
      data: {
        ...(orderNumber && { orderNumber }),
        ...(customer && { customer }),
        ...(status && { status }),
        ...(statusTimeline && { statusTimeline }),
        ...(estimatedDelivery && { estimatedDelivery }),
        ...(items && {
          items: items.map((item) => ({
            product: item.product,
            quantity: item.quantity || 1,
          })),
        }),
        ...(calculatedPricing && { pricing: calculatedPricing }),
        ...(tracking && { tracking }),
        ...(finalShippingAddress && { shippingAddress: finalShippingAddress }),
        ...(finalBillingAddress && { billingAddress: finalBillingAddress }),
        ...(shippingMethod && { shippingMethod }),
      },
    })

    return Response.json(
      { success: true, message: 'แก้ไขคำสั่งซื้อเรียบร้อยแล้ว', data: updatedOrder },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถแก้ไขคำสั่งซื้อได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const deleteOrder = async (req: any) => {
  try {
    // Check permission - only admins can delete orders
    if (req.user?.collection !== 'admins') {
      return Response.json(
        { success: false, message: 'ไม่สามารถลบคำสั่งซื้อได้ - ไม่มีสิทธิ์' },
        { status: 403 },
      )
    }

    const { id } = req.routeParams
    if (!id) {
      return Response.json(
        { success: false, message: 'กรุณาระบุ ID คำสั่งซื้อ' },
        { status: 400 },
      )
    }

    const order = await req.payload.findByID({
      collection: 'orders',
      id: id,
    })

    if (!order) {
      return Response.json(
        { success: false, message: 'ไม่พบคำสั่งซื้อที่ระบุ' },
        { status: 404 },
      )
    }

    const deletedOrder = await req.payload.delete({
      collection: 'orders',
      id: id,
    })

    return Response.json(
      { success: true, message: 'ลบคำสั่งซื้อเรียบร้อยแล้ว', data: deletedOrder },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'ไม่สามารถลบคำสั่งซื้อได้',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

