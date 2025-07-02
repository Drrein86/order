import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// מחיקת תוספת מוצר
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; optionId: string } }
) {
  try {
    // מחיקת כל ערכי התוספת תחילה
    await prisma.productOptionValue.deleteMany({
      where: { productOptionId: params.optionId }
    })

    // מחיקת התוספת עצמה
    await prisma.productOption.delete({
      where: { id: params.optionId }
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