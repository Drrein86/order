import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// מחיקת תוספת מוצר
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; optionId: string }> }
) {
  try {
    const { productId, optionId } = await params

    // מחיקת התוספת (הערכים יימחקו אוטומטית בגלל CASCADE)
    await prisma.productOption.delete({
      where: { 
        id: optionId,
        productId // וידוא שהתוספת שייכת למוצר הנכון
      }
    })

    return NextResponse.json({
      success: true,
      message: 'התוספת נמחקה בהצלחה'
    })

  } catch (error) {
    console.error('Error deleting product option:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת התוספת' },
      { status: 500 }
    )
  }
} 