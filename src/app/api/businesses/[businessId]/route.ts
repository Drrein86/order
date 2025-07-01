import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const businessId = params.businessId

    const business = await prisma.business.findUnique({
      where: { 
        id: businessId,
        isActive: true 
      },
      include: {
        businessSettings: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'העסק לא נמצא' },
        { status: 404 }
      )
    }

    // המרה לפורמט BusinessConfig
    const businessConfig = {
      id: business.id,
      name: business.name,
      logo: business.logo,
      backgroundVideo: business.businessSettings?.backgroundVideo,
      colors: {
        primary: business.businessSettings?.primaryColor || '#3B82F6',
        secondary: business.businessSettings?.secondaryColor || '#F59E0B',
        accent: business.businessSettings?.accentColor || '#10B981',
        text: business.businessSettings?.textColor || '#1F2937'
      },
      settings: {
        whatsappNumber: business.businessSettings?.whatsappNumber,
        emailEnabled: business.businessSettings?.emailEnabled || true,
        whatsappEnabled: business.businessSettings?.whatsappEnabled || true,
        printingEnabled: business.businessSettings?.printingEnabled || true,
        isOrderingOpen: business.businessSettings?.isOrderingOpen || true
      }
    }

    return NextResponse.json({
      success: true,
      data: businessConfig
    })

  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת נתוני העסק' },
      { status: 500 }
    )
  }
} 