import type { 
  Business, 
  BusinessUser, 
  BusinessSettings, 
  Category, 
  Product, 
  ProductOption, 
  ProductOptionValue,
  Customer,
  Order,
  OrderItem,
  OrderItemOption,
  OrderType,
  OrderStatus,
  ProductOptionType,
  BusinessUserRole
} from '../generated/prisma'

// Extended types with relations
export type BusinessWithSettings = Business & {
  businessSettings?: BusinessSettings | null
}

export type CategoryWithProducts = Category & {
  products: ProductWithOptions[]
}

export type ProductWithOptions = Product & {
  productOptions: ProductOptionWithValues[]
}

export type ProductOptionWithValues = ProductOption & {
  productOptionValues: ProductOptionValue[]
}

export type OrderWithDetails = Order & {
  customer: Customer
  orderItems: OrderItemWithDetails[]
}

export type OrderItemWithDetails = OrderItem & {
  product: Product
  orderItemOptions: OrderItemOptionWithDetails[]
}

export type OrderItemOptionWithDetails = OrderItemOption & {
  productOption: ProductOption
  productOptionValue?: ProductOptionValue | null
}

// Form types
export interface CustomerFormData {
  name: string
  phone: string
  email?: string
}

export interface CartItem {
  product: ProductWithOptions
  quantity: number
  selectedOptions: SelectedOption[]
  notes?: string
}

export interface SelectedOption {
  optionId: string
  optionName: string
  valueId?: string
  valueName?: string
  textValue?: string
  additionalPrice: number
}

export interface CreateOrderData {
  businessId: string
  orderType: OrderType
  customer: CustomerFormData
  items: CartItem[]
  totalAmount: number
  notes?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Business configuration
export interface BusinessConfig {
  id: string
  name: string
  logo?: string
  backgroundVideo?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
  }
  settings: {
    whatsappNumber?: string
    emailEnabled: boolean
    whatsappEnabled: boolean
    printingEnabled: boolean
    isOrderingOpen: boolean
  }
}

// Export Prisma types
export {
  Business,
  BusinessUser,
  BusinessSettings,
  Category,
  Product,
  ProductOption,
  ProductOptionValue,
  Customer,
  Order,
  OrderItem,
  OrderItemOption,
  OrderType,
  OrderStatus,
  ProductOptionType,
  BusinessUserRole
} 