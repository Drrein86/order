import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 יצירת נתוני דמו...')

  // קבלת העסק הראשון שנוצר
  const business = await prisma.business.findFirst({
    orderBy: { createdAt: 'asc' }
  })

  if (!business) {
    console.log('❌ לא נמצא עסק במערכת')
    return
  }

  console.log(`✅ נמצא עסק: ${business.name} (${business.id})`)

  // יצירת קטגוריות
  const categories = [
    {
      name: 'מנות ראשונות',
      description: 'סלטים, מרקים וטפסים',
      order: 1
    },
    {
      name: 'מנות עיקריות',
      description: 'בשר, עוף ודגים',
      order: 2
    },
    {
      name: 'פיצות',
      description: 'פיצות טריות מהתנור',
      order: 3
    },
    {
      name: 'משקאות',
      description: 'משקאות חמים וקרים',
      order: 4
    },
    {
      name: 'קינוחים',
      description: 'קינוחים ועוגות',
      order: 5
    }
  ]

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        businessId: business.id,
        ...categoryData
      }
    })
    console.log(`✅ נוצרה קטגוריה: ${category.name}`)

    // הוספת מוצרים לכל קטגוריה
    if (categoryData.name === 'מנות ראשונות') {
      const products = [
        { name: 'סלט ירוק', description: 'סלט עלים ירוקים טרי', price: 28.00, order: 1 },
        { name: 'חומוס', description: 'חומוס ביתי עם שמן זית', price: 18.00, order: 2 },
        { name: 'מרק יום', description: 'מרק טרי של השף', price: 22.00, order: 3 }
      ]

      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            ...productData
          }
        })
        console.log(`  ➡️ נוצר מוצר: ${product.name}`)
      }
    }

    if (categoryData.name === 'מנות עיקריות') {
      const products = [
        { name: 'סטייק אנטריקוט', description: 'סטייק טרי על הגריל', price: 89.00, order: 1 },
        { name: 'עוף בגריל', description: 'חזה עוף מתובל', price: 65.00, order: 2 },
        { name: 'דג לוקוס', description: 'דג טרי בתנור', price: 78.00, order: 3 }
      ]

      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            ...productData
          }
        })
        console.log(`  ➡️ נוצר מוצר: ${product.name}`)

        // הוספת תוספות למנות עיקריות
        const option = await prisma.productOption.create({
          data: {
            productId: product.id,
            name: 'רמת צלייה',
            type: 'SINGLE_CHOICE',
            isRequired: true,
            order: 1
          }
        })

        const optionValues = [
          { name: 'מדיום רייר', additionalPrice: 0 },
          { name: 'מדיום', additionalPrice: 0 },
          { name: 'מדיום וול', additionalPrice: 0 },
          { name: 'וול דאן', additionalPrice: 0 }
        ]

        for (const [index, valueData] of optionValues.entries()) {
          await prisma.productOptionValue.create({
            data: {
              productOptionId: option.id,
              ...valueData,
              order: index + 1
            }
          })
        }
      }
    }

    if (categoryData.name === 'פיצות') {
      const products = [
        { name: 'פיצה מרגריטה', description: 'רוטב עגבניות, מוצרלה וריחן', price: 45.00, order: 1 },
        { name: 'פיצה פפרוני', description: 'רוטב עגבניות, מוצרלה ופפרוני', price: 52.00, order: 2 },
        { name: 'פיצה עליונה', description: 'כל התוספות', price: 68.00, order: 3 }
      ]

      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            ...productData
          }
        })
        console.log(`  ➡️ נוצר מוצר: ${product.name}`)

        // גודל פיצה
        const sizeOption = await prisma.productOption.create({
          data: {
            productId: product.id,
            name: 'גודל',
            type: 'SINGLE_CHOICE',
            isRequired: true,
            order: 1
          }
        })

        const sizes = [
          { name: 'אישית', additionalPrice: 0 },
          { name: 'משפחתית', additionalPrice: 15 },
          { name: 'ענקית', additionalPrice: 25 }
        ]

        for (const [index, sizeData] of sizes.entries()) {
          await prisma.productOptionValue.create({
            data: {
              productOptionId: sizeOption.id,
              ...sizeData,
              order: index + 1
            }
          })
        }

        // תוספות לפיצה
        const toppingsOption = await prisma.productOption.create({
          data: {
            productId: product.id,
            name: 'תוספות',
            type: 'MULTIPLE_CHOICE',
            isRequired: false,
            order: 2
          }
        })

        const toppings = [
          { name: 'זיתים', additionalPrice: 3 },
          { name: 'פטריות', additionalPrice: 4 },
          { name: 'בצל', additionalPrice: 2 },
          { name: 'עגבניות', additionalPrice: 3 },
          { name: 'גבינה נוספת', additionalPrice: 8 }
        ]

        for (const [index, toppingData] of toppings.entries()) {
          await prisma.productOptionValue.create({
            data: {
              productOptionId: toppingsOption.id,
              ...toppingData,
              order: index + 1
            }
          })
        }
      }
    }

    if (categoryData.name === 'משקאות') {
      const products = [
        { name: 'קולה', description: 'קולה קרה', price: 8.00, order: 1 },
        { name: 'מים', description: 'מים מינרליים', price: 5.00, order: 2 },
        { name: 'קפה', description: 'קפה טרי', price: 12.00, order: 3 },
        { name: 'תה', description: 'תה חם', price: 10.00, order: 4 }
      ]

      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            ...productData
          }
        })
        console.log(`  ➡️ נוצר מוצר: ${product.name}`)
      }
    }

    if (categoryData.name === 'קינוחים') {
      const products = [
        { name: 'טירמיסו', description: 'קינוח איטלקי קלאסי', price: 32.00, order: 1 },
        { name: 'שוקולד סופלה', description: 'עוגת שוקולד חמה', price: 28.00, order: 2 },
        { name: 'גלידה', description: 'גלידה בטעמים שונים', price: 18.00, order: 3 }
      ]

      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            ...productData
          }
        })
        console.log(`  ➡️ נוצר מוצר: ${product.name}`)
      }
    }
  }

  // עדכון הגדרות העסק
  await prisma.businessSettings.update({
    where: { businessId: business.id },
    data: {
      isOrderingOpen: true
    }
  })

  console.log(`🎉 סיימנו! מסך ההזמנות זמין בכתובת:`)
  console.log(`🔗 http://localhost:3000/screen/${business.id}`)
  console.log(`👨‍💼 כניסה לאדמין: http://localhost:3000/admin/login`)
  console.log(`📧 אימיל מנהל: admin@restaurant.com`)
  console.log(`🔑 סיסמה: 123456`)
}

main()
  .catch((e) => {
    console.error('❌ שגיאה:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 