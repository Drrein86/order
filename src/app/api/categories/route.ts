import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'שם הקטגוריה נדרש'),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  businessId: z.string().min(1, 'מזהה עסק נדרש')
})

const UpdateCategorySchema = CreateCategorySchema.partial()

// יצירת קטגוריה חדשה
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateCategorySchema.parse(body)

    // קבלת הסדר הגבוה ביותר הנוכחי
    const lastCategory = await prisma.category.findFirst({
      where: { businessId: validatedData.businessId },
      orderBy: { order: 'desc' }
    })

    const category = await prisma.category.create({
      data: {
        businessId: validatedData.businessId,
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        order: validatedData.order ?? (lastCategory?.order ?? 0) + 1
      }
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'הקטגוריה נוצרה בהצלחה'
    })

  } catch (error) {
    console.error('Error creating category:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת הקטגוריה' },
      { status: 500 }
    )
  }
}

// קבלת קטגוריות לעסק
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'מזהה עסק נדרש' },
        { status: 400 }
      )
    }

    const categories = await prisma.category.findMany({
      where: { 
        businessId: businessId,
        isActive: true 
      },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            productOptions: {
              orderBy: { sortOrder: 'asc' },
              include: {
                productOptionValues: {
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת הקטגוריות' },
      { status: 500 }
    )
  }
} 