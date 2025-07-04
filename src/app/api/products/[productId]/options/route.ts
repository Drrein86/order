import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const CreateProductOptionSchema = z.object({
  name: z.string().min(1, 'שם התוספת נדרש'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
  isRequired: z.boolean(),
  values: z.array(z.object({
    name: z.string().min(1, 'שם הערך נדרש'),
    price: z.number().min(0, 'מחיר חייב להיות חיובי')
  })).min(1, 'חייב להיות לפחות ערך אחד')
})

// הוספת תוספת חדשה למוצר
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()
    const validatedData = CreateProductOptionSchema.parse(body)

    // קבלת הסדר הגבוה ביותר הנוכחי
    const lastOption = await prisma.productOption.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' }
    })

    // יצירת התוספת עם ערכיה
    const productOption = await prisma.productOption.create({
      data: {
        productId,
        name: validatedData.name,
        type: validatedData.type,
        isRequired: validatedData.isRequired,
        sortOrder: (lastOption?.sortOrder ?? 0) + 1,
        productOptionValues: {
          create: validatedData.values.map((value, index) => ({
            name: value.name,
            price: value.price,
            sortOrder: index + 1
          }))
        }
      },
      include: {
        productOptionValues: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: productOption,
      message: 'התוספת נוספה בהצלחה'
    })

  } catch (error) {
    console.error('Error creating product option:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת התוספת' },
      { status: 500 }
    )
  }
} 