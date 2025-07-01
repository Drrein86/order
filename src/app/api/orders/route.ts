import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { formatOrderForEmail, formatOrderForWhatsApp, generateOrderNumber } from '@/lib/utils'
import nodemailer from 'nodemailer'

const CreateOrderSchema = z.object({
  businessId: z.string().min(1),
  orderType: z.enum(['DINE_IN', 'TAKEAWAY']),
  customer: z.object({
    name: z.string().min(1, 'שם הלקוח נדרש'),
    phone: z.string().min(10, 'מספר טלפון לא תקין'),
    email: z.string().email().optional()
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    notes: z.string().optional(),
    selectedOptions: z.array(z.object({
      optionId: z.string(),
      optionName: z.string(),
      valueId: z.string().optional(),
      valueName: z.string().optional(),
      textValue: z.string().optional(),
      additionalPrice: z.number().default(0)
    }))
  })).min(1, 'חייב להיות לפחות פריט אחד'),
  totalAmount: z.number().min(0.01),
  notes: z.string().optional()
})

// יצירת הזמנה חדשה
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateOrderSchema.parse(body)

    // יצירת ההזמנה בטרנזקציה אטומית
    const result = await prisma.$transaction(async (tx) => {
      // 1. קבלת/יצירת לקוח
      let customer = await tx.customer.findUnique({
        where: { phone: validatedData.customer.phone }
      })

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: validatedData.customer.name,
            phone: validatedData.customer.phone,
            email: validatedData.customer.email
          }
        })
      }

      // 2. קבלת הגדרות העסק למספור הזמנות
      const businessSettings = await tx.businessSettings.findUnique({
        where: { businessId: validatedData.businessId }
      })

      if (!businessSettings) {
        throw new Error('הגדרות העסק לא נמצאו')
      }

      // 3. יצירת מספר הזמנה חדש
      const lastOrder = await tx.order.findFirst({
        where: { businessId: validatedData.businessId },
        orderBy: { orderNumber: 'desc' }
      })

      const orderNumber = generateOrderNumber(lastOrder?.orderNumber ?? businessSettings.orderStartNumber - 1)

      // 4. יצירת ההזמנה
      const order = await tx.order.create({
        data: {
          businessId: validatedData.businessId,
          customerId: customer.id,
          orderNumber,
          orderType: validatedData.orderType,
          totalAmount: validatedData.totalAmount,
          notes: validatedData.notes,
          status: 'PENDING'
        }
      })

      // 5. יצירת פריטי ההזמנה
      for (const item of validatedData.items) {
        // קבלת מחיר המוצר
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error(`מוצר לא נמצא: ${item.productId}`)
        }

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            totalPrice: product.price * item.quantity + 
                       item.selectedOptions.reduce((sum, opt) => sum + opt.additionalPrice, 0) * item.quantity,
            notes: item.notes
          }
        })

        // 6. יצירת תוספות לפריט
        for (const option of item.selectedOptions) {
          await tx.orderItemOption.create({
            data: {
              orderItemId: orderItem.id,
              productOptionId: option.optionId,
              productOptionValueId: option.valueId,
              textValue: option.textValue,
              additionalPrice: option.additionalPrice
            }
          })
        }
      }

      return { order, customer, businessSettings }
    })

    // 7. קבלת ההזמנה המלאה עם כל הפרטים
    const fullOrder = await prisma.order.findUnique({
      where: { id: result.order.id },
      include: {
        customer: true,
        business: true,
        orderItems: {
          include: {
            product: true,
            orderItemOptions: {
              include: {
                productOption: true,
                productOptionValue: true
              }
            }
          }
        }
      }
    })

    if (!fullOrder) {
      throw new Error('שגיאה בקבלת פרטי ההזמנה')
    }

    // 8. שליחת התראות (אסינכרוני)
    sendNotifications(fullOrder, result.businessSettings)

    return NextResponse.json({
      success: true,
      data: {
        order: fullOrder,
        orderNumber: result.order.orderNumber
      },
      message: `הזמנה #${result.order.orderNumber} נוצרה בהצלחה`
    })

  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'שגיאה ביצירת ההזמנה' },
      { status: 500 }
    )
  }
}

// קבלת הזמנות לעסק
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'מזהה עסק נדרש' },
        { status: 400 }
      )
    }

    const where: any = { businessId }
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
              orderItemOptions: {
                include: {
                  productOption: true,
                  productOptionValue: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        orders,
        total,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת ההזמנות' },
      { status: 500 }
    )
  }
}

// פונקציה לשליחת התראות (אסינכרונית)
async function sendNotifications(order: any, settings: any) {
  try {
    const promises = []

    // שליחת מייל
    if (settings.emailEnabled && process.env.EMAIL_HOST) {
      promises.push(sendEmailNotification(order))
    }

    // שליחת WhatsApp
    if (settings.whatsappEnabled && settings.whatsappNumber) {
      promises.push(sendWhatsAppNotification(order, settings.whatsappNumber))
    }

    // השלחה מקבילה
    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Error sending notifications:', error)
  }
}

// שליחת מייל
async function sendEmailNotification(order: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const cartItems = order.orderItems.map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
      notes: item.notes,
      selectedOptions: item.orderItemOptions.map((opt: any) => ({
        optionName: opt.productOption.name,
        valueName: opt.productOptionValue?.name,
        textValue: opt.textValue,
        additionalPrice: opt.additionalPrice
      }))
    }))

    const emailData = formatOrderForEmail({
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: cartItems,
      totalAmount: order.totalAmount,
      orderType: order.orderType,
      createdAt: order.createdAt
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: order.business.email,
      subject: emailData.subject,
      html: emailData.html
    })

    console.log(`Email sent for order #${order.orderNumber}`)
  } catch (error) {
    console.error('Email sending failed:', error)
  }
}

// שליחת WhatsApp
async function sendWhatsAppNotification(order: any, whatsappNumber: string) {
  try {
    const cartItems = order.orderItems.map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
      notes: item.notes,
      selectedOptions: item.orderItemOptions.map((opt: any) => ({
        optionName: opt.productOption.name,
        valueName: opt.productOptionValue?.name,
        textValue: opt.textValue,
        additionalPrice: opt.additionalPrice
      }))
    }))

    const message = formatOrderForWhatsApp({
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: cartItems,
      totalAmount: order.totalAmount,
      orderType: order.orderType
    })

    // יצירת קישור WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    console.log(`WhatsApp link created for order #${order.orderNumber}: ${whatsappUrl}`)
    
    // כאן תוכל להוסיף שליחה אוטומטית אם יש לך WhatsApp Business API
    
  } catch (error) {
    console.error('WhatsApp sending failed:', error)
  }
} 