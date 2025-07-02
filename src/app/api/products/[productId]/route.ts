import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const UpdateProductSchema = z.object({
  name: z.string().min(1, 'שם המוצר נדרש').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'מחיר חייב להיות חיובי').optional(),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'מזהה קטגוריה נדרש').optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional()
})

// קבלת מוצר ספציפי
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'המוצר לא נמצא' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת המוצר' },
      { status: 500 }
    )
  }
}

// עדכון מוצר
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()
    const validatedData = UpdateProductSchema.parse(body)

    const product = await prisma.product.update({
      where: { id: productId },
      data: validatedData,
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
      message: 'המוצר עודכן בהצלחה'
    })

  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון המוצר' },
      { status: 500 }
    )
  }
}

// מחיקת מוצר
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({
      success: true,
      message: 'המוצר נמחק בהצלחה'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת המוצר' },
      { status: 500 }
    )
  }
} 