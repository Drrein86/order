import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CartItem, SelectedOption } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS'
  }).format(amount)
}

// Calculate cart total
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const itemPrice = item.product.basePrice || item.product.price || 0
    const optionsPrice = item.selectedOptions.reduce((sum, option) => sum + option.additionalPrice, 0)
    return total + ((itemPrice + optionsPrice) * item.quantity)
  }, 0)
}

// Calculate item total
export function calculateItemTotal(item: CartItem): number {
  const itemPrice = item.product.basePrice || item.product.price || 0
  const optionsPrice = item.selectedOptions.reduce((sum, option) => sum + option.additionalPrice, 0)
  return (itemPrice + optionsPrice) * item.quantity
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Add Israeli country code if needed
  if (digitsOnly.length === 9 && digitsOnly.startsWith('5')) {
    return `972${digitsOnly}`
  }
  
  if (digitsOnly.length === 10 && digitsOnly.startsWith('05')) {
    return `972${digitsOnly.substring(1)}`
  }
  
  return digitsOnly
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Israeli phone number
export function isValidIsraeliPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 9 && digitsOnly.length <= 13
}

// Generate order number
export function generateOrderNumber(lastOrderNumber: number): number {
  return lastOrderNumber + 1
}

// Format order for WhatsApp
export function formatOrderForWhatsApp(order: {
  orderNumber: number
  customer: { name: string; phone: string }
  items: CartItem[]
  totalAmount: number
  orderType: 'DINE_IN' | 'TAKEAWAY'
}): string {
  const orderTypeText = order.orderType === 'DINE_IN' ? 'שבת במקום' : 'טייקאווי'
  
  let message = `🍽️ הזמנה חדשה #${order.orderNumber}\n\n`
  message += `👤 שם: ${order.customer.name}\n`
  message += `📞 טלפון: ${order.customer.phone}\n`
  message += `📦 סוג הזמנה: ${orderTypeText}\n\n`
  message += `🛒 פריטים:\n`
  
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name} x${item.quantity}\n`
    if (item.selectedOptions.length > 0) {
      item.selectedOptions.forEach(option => {
        const value = option.valueName || option.textValue || ''
        const price = option.additionalPrice > 0 ? ` (+${formatCurrency(option.additionalPrice)})` : ''
        message += `   • ${option.optionName}: ${value}${price}\n`
      })
    }
    if (item.notes) {
      message += `   💬 הערות: ${item.notes}\n`
    }
    message += `   💰 סכום: ${formatCurrency(calculateItemTotal(item))}\n\n`
  })
  
  message += `💳 סה"כ לתשלום: ${formatCurrency(order.totalAmount)}\n`
  
  return message
}

// Format order for email
export function formatOrderForEmail(order: {
  orderNumber: number
  customer: { name: string; phone: string; email?: string }
  items: CartItem[]
  totalAmount: number
  orderType: 'DINE_IN' | 'TAKEAWAY'
  createdAt: Date
}): { subject: string; html: string } {
  const orderTypeText = order.orderType === 'DINE_IN' ? 'שבת במקום' : 'טייקאווי'
  
  const subject = `הזמנה חדשה #${order.orderNumber} - ${order.customer.name}`
  
  let html = `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <h2>🍽️ הזמנה חדשה #${order.orderNumber}</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>פרטי לקוח:</h3>
        <p><strong>שם:</strong> ${order.customer.name}</p>
        <p><strong>טלפון:</strong> ${order.customer.phone}</p>
        ${order.customer.email ? `<p><strong>אימייל:</strong> ${order.customer.email}</p>` : ''}
        <p><strong>סוג הזמנה:</strong> ${orderTypeText}</p>
        <p><strong>זמן הזמנה:</strong> ${order.createdAt.toLocaleString('he-IL')}</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>פריטים:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e9e9e9;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">פריט</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">כמות</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">תוספות</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">מחיר</th>
            </tr>
          </thead>
          <tbody>
  `
  
  order.items.forEach(item => {
    const optionsText = item.selectedOptions.map(option => {
      const value = option.valueName || option.textValue || ''
      const price = option.additionalPrice > 0 ? ` (+${formatCurrency(option.additionalPrice)})` : ''
      return `${option.optionName}: ${value}${price}`
    }).join('<br>')
    
    html += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">
          ${item.product.name}
          ${item.notes ? `<br><small style="color: #666;">הערות: ${item.notes}</small>` : ''}
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${optionsText || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatCurrency(calculateItemTotal(item))}</td>
      </tr>
    `
  })
  
  html += `
          </tbody>
        </table>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0;">💳 סה"כ לתשלום: ${formatCurrency(order.totalAmount)}</h3>
      </div>
    </div>
  `
  
  return { subject, html }
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
} 