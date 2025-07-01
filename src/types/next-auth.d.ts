import type { BusinessUserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: BusinessUserRole
      businessId: string
      businessName: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: BusinessUserRole
    businessId: string
    businessName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: BusinessUserRole
    businessId: string
    businessName: string
  }
} 