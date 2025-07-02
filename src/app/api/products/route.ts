import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const CreateProductSchema = z.object({
  name: z.string().min(1, 'שם המוצר נדרש'),
  description: z.string().optional(),
  price: z.number().min(0, 'מחיר חייב להיות חיובי'),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'מזהה קטגוריה נדרש'),
  businessId: z.string().min(1, 'מזהה עסק נדרש'),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional()
})

const UpdateProductSchema = CreateProductSchema.partial()

// יצירת מוצר חדש
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateProductSchema.parse(body)

    // קבלת הסדר הגבוה ביותר הנוכחי בקטגוריה
    const lastProduct = await prisma.product.findFirst({
      where: { 
        categoryId: validatedData.categoryId,
        businessId: validatedData.businessId 
      },
      orderBy: { sortOrder: 'desc' }
    })

    const product = await prisma.product.create({
      data: {
        businessId: validatedData.businessId,
        categoryId: validatedData.categoryId,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        image: validatedData.image,
        sortOrder: validatedData.sortOrder ?? (lastProduct?.sortOrder ?? 0) + 1,
        isActive: validatedData.isActive ?? true
      },
      include: {
        category: true,
        productOptions: {
          include: {
            productOptionValues: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'המוצר נוצר בהצלחה'
    })

  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת המוצר' },
      { status: 500 }
    )
  }
}

// קבלת מוצרים לעסק
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const categoryId = searchParams.get('categoryId')
    
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'מזהה עסק נדרש' },
        { status: 400 }
      )
    }

    const whereClause: any = { 
      businessId: businessId,
      isActive: true 
    }

    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        productOptions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            productOptionValues: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: products
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת המוצרים' },
      { status: 500 }
    )
  }
} 