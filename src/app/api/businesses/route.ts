import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const CreateBusinessSchema = z.object({
  name: z.string().min(1, 'שם העסק נדרש'),
  email: z.string().email('כתובת אימיל לא תקינה'),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  adminName: z.string().min(1, 'שם מנהל נדרש'),
  adminEmail: z.string().email('כתובת אימיל מנהל לא תקינה'),
  adminPassword: z.string().min(6, 'סיסמה חייבת להיות לפחות 6 תווים')
})

// יצירת עסק חדש עם מנהל
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateBusinessSchema.parse(body)

    // בדיקה אם האימיל כבר קיים
    const existingUser = await prisma.businessUser.findFirst({
      where: { email: validatedData.adminEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'משתמש עם האימיל הזה כבר קיים' },
        { status: 400 }
      )
    }

    // יצירת העסק והמנהל בטרנזקציה
    const result = await prisma.$transaction(async (tx) => {
      // יצירת העסק
      const business = await tx.business.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          description: validatedData.description,
        }
      })

      // יצירת הגדרות בסיסיות לעסק
      await tx.businessSettings.create({
        data: {
          businessId: business.id,
          primaryColor: '#3B82F6',
          secondaryColor: '#F59E0B',
          accentColor: '#10B981',
          textColor: '#1F2937',
        }
      })

      // יצירת המנהל
      const hashedPassword = await bcrypt.hash(validatedData.adminPassword, 12)
      const admin = await tx.businessUser.create({
        data: {
          businessId: business.id,
          email: validatedData.adminEmail,
          name: validatedData.adminName,
          password: hashedPassword,
          role: 'ADMIN'
        }
      })

      return { business, admin }
    })

    return NextResponse.json({
      success: true,
      data: {
        business: result.business,
        admin: { ...result.admin, password: undefined }
      },
      message: 'העסק נוצר בהצלחה'
    })

  } catch (error) {
    console.error('Error creating business:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת העסק' },
      { status: 500 }
    )
  }
}

// קבלת עסקים (למשתמשי SUPER_ADMIN)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const businesses = await prisma.business.findMany({
      include: {
        businessSettings: true,
        _count: {
          select: {
            categories: true,
            orders: true,
            businessUsers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: businesses
    })

  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת העסקים' },
      { status: 500 }
    )
  }
} 