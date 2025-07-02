import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 מתחיל יצירת נתוני דמו...')

  // יצירת עסק
  const business = await prisma.business.create({
    data: {
      name: 'פיצה אקספרס',
      email: 'info@pizza-express.co.il',
      phone: '03-1234567',
      address: 'רחוב הרצל 123, תל אביב',
      description: 'הפיצה הטובה ביותר בעיר',
      logo: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=🍕',
    },
  })

  console.log('✅ עסק נוצר:', business.name)

  // יצירת משתמש אדמין
  const adminUser = await prisma.businessUser.create({
    data: {
      businessId: business.id,
      email: 'admin@pizza-express.co.il',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqGm', // password: admin123
      name: 'מנהל ראשי',
      role: 'OWNER',
    },
  })

  console.log('✅ משתמש אדמין נוצר:', adminUser.name)

  // יצירת הגדרות עסק
  const settings = await prisma.businessSettings.create({
    data: {
      businessId: business.id,
      backgroundVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      accentColor: '#45B7D1',
      textColor: '#2C3E50',
      whatsappNumber: '972501234567',
      emailEnabled: true,
      whatsappEnabled: true,
      printingEnabled: true,
      isOrderingOpen: true,
      orderStartNumber: 1,
    },
  })

  console.log('✅ הגדרות עסק נוצרו')

  // יצירת קטגוריות
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'פיצות',
        description: 'פיצות טריות מהתנור',
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🍕',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'המבורגרים',
        description: 'המבורגרים עסיסיים',
        image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=🍔',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'מנות ראשונות',
        description: 'סלטים ומנות פתיחה',
        image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=🥗',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'משקאות',
        description: 'משקאות קרים וחמים',
        image: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=🥤',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'קינוחים',
        description: 'קינוחים מתוקים',
        image: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=🍰',
        order: 5,
      },
    }),
  ])

  console.log('✅ קטגוריות נוצרו:', categories.length)

  // יצירת פיצות עם אפשרויות מתקדמות
  const pizzaCategory = categories[0]
  
  // פיצה מרגריטה
  const margheritaPizza = await prisma.product.create({
    data: {
      categoryId: pizzaCategory.id,
      businessId: business.id,
      name: 'פיצה מרגריטה',
      description: 'פיצה קלאסית עם רוטב עגבניות, מוצרלה ובזיליקום',
      basePrice: 45.00,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🍕',
      sortOrder: 1,
    },
  })

  // אפשרויות לפיצה מרגריטה
  const pizzaSizeOption = await prisma.productOption.create({
    data: {
      productId: margheritaPizza.id,
      name: 'גודל פיצה',
      type: 'SINGLE_CHOICE',
      isRequired: true,
      sortOrder: 1,
    },
  })

  const pizzaHalfOption = await prisma.productOption.create({
    data: {
      productId: margheritaPizza.id,
      name: 'סוג פיצה',
      type: 'HALF_AND_HALF',
      isRequired: true,
      sortOrder: 2,
    },
  })

  const pizzaToppingsOption = await prisma.productOption.create({
    data: {
      productId: margheritaPizza.id,
      name: 'תוספות',
      type: 'MULTIPLE_CHOICE',
      isRequired: false,
      sortOrder: 3,
    },
  })

  // ערכי גודל פיצה
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaSizeOption.id,
        name: 'קטנה (25 ס"מ)',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaSizeOption.id,
        name: 'בינונית (30 ס"מ)',
        additionalPrice: 10.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaSizeOption.id,
        name: 'גדולה (35 ס"מ)',
        additionalPrice: 20.00,
        isDefault: false,
        sortOrder: 3,
      },
    }),
  ])

  // ערכי סוג פיצה (חצי/שלמה)
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaHalfOption.id,
        name: 'פיצה שלמה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
        halfPosition: 'FULL',
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaHalfOption.id,
        name: 'חצי פיצה',
        additionalPrice: -15.00,
        isDefault: false,
        sortOrder: 2,
        halfPosition: 'HALF',
      },
    }),
  ])

  // ערכי תוספות
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaToppingsOption.id,
        name: 'פטריות',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaToppingsOption.id,
        name: 'זיתים',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaToppingsOption.id,
        name: 'פלפל',
        additionalPrice: 3.00,
        isDefault: false,
        sortOrder: 3,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: pizzaToppingsOption.id,
        name: 'בשר טחון',
        additionalPrice: 8.00,
        isDefault: false,
        sortOrder: 4,
      },
    }),
  ])

  // פיצה חצי/שלמה מתקדמת
  const halfHalfPizza = await prisma.product.create({
    data: {
      categoryId: pizzaCategory.id,
      businessId: business.id,
      name: 'פיצה חצי/שלמה',
      description: 'בחר שני סוגי פיצה שונים - חצי מכל סוג',
      basePrice: 55.00,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=🍕🍕',
      sortOrder: 2,
    },
  })

  // אפשרויות לפיצה חצי/שלמה
  const halfHalfSizeOption = await prisma.productOption.create({
    data: {
      productId: halfHalfPizza.id,
      name: 'גודל פיצה',
      type: 'SINGLE_CHOICE',
      isRequired: true,
      sortOrder: 1,
    },
  })

  const leftHalfOption = await prisma.productOption.create({
    data: {
      productId: halfHalfPizza.id,
      name: 'חצי שמאל',
      type: 'SINGLE_CHOICE',
      isRequired: true,
      sortOrder: 2,
      isHalfOption: true,
    },
  })

  const rightHalfOption = await prisma.productOption.create({
    data: {
      productId: halfHalfPizza.id,
      name: 'חצי ימין',
      type: 'SINGLE_CHOICE',
      isRequired: true,
      sortOrder: 3,
      isHalfOption: true,
    },
  })

  // ערכי גודל
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: halfHalfSizeOption.id,
        name: 'בינונית (30 ס"מ)',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: halfHalfSizeOption.id,
        name: 'גדולה (35 ס"מ)',
        additionalPrice: 10.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
  ])

  // ערכי חצי שמאל
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: leftHalfOption.id,
        name: 'מרגריטה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
        halfPosition: 'LEFT',
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: leftHalfOption.id,
        name: 'פפרוני',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 2,
        halfPosition: 'LEFT',
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: leftHalfOption.id,
        name: 'פטריות',
        additionalPrice: 3.00,
        isDefault: false,
        sortOrder: 3,
        halfPosition: 'LEFT',
      },
    }),
  ])

  // ערכי חצי ימין
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: rightHalfOption.id,
        name: 'מרגריטה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
        halfPosition: 'RIGHT',
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: rightHalfOption.id,
        name: 'פפרוני',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 2,
        halfPosition: 'RIGHT',
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: rightHalfOption.id,
        name: 'פטריות',
        additionalPrice: 3.00,
        isDefault: false,
        sortOrder: 3,
        halfPosition: 'RIGHT',
      },
    }),
  ])

  // יצירת המבורגרים עם רכיבים מתקדמים
  const burgerCategory = categories[1]
  
  const classicBurger = await prisma.product.create({
    data: {
      categoryId: burgerCategory.id,
      businessId: business.id,
      name: 'המבורגר קלאסי',
      description: 'המבורגר עם בשר בקר, חסה, עגבניה ובצל',
      basePrice: 35.00,
      image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=🍔',
      sortOrder: 1,
    },
  })

  // אפשרויות להמבורגר
  const burgerSizeOption = await prisma.productOption.create({
    data: {
      productId: classicBurger.id,
      name: 'גודל המבורגר',
      type: 'SINGLE_CHOICE',
      isRequired: true,
      sortOrder: 1,
    },
  })

  const burgerIngredientsOption = await prisma.productOption.create({
    data: {
      productId: classicBurger.id,
      name: 'רכיבים',
      type: 'MULTIPLE_CHOICE',
      isRequired: false,
      sortOrder: 2,
    },
  })

  const sideDishOption = await prisma.productOption.create({
    data: {
      productId: classicBurger.id,
      name: 'תוספת צד',
      type: 'SINGLE_CHOICE',
      isRequired: false,
      sortOrder: 3,
    },
  })

  const drinkOption = await prisma.productOption.create({
    data: {
      productId: classicBurger.id,
      name: 'משקה',
      type: 'SINGLE_CHOICE',
      isRequired: false,
      sortOrder: 4,
    },
  })

  // ערכי גודל המבורגר
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerSizeOption.id,
        name: 'רגיל (150 גרם)',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerSizeOption.id,
        name: 'כפול (300 גרם)',
        additionalPrice: 15.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
  ])

  // ערכי רכיבים
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'חסה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'עגבניה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 2,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'בצל',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 3,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'גבינה צהובה',
        additionalPrice: 3.00,
        isDefault: false,
        sortOrder: 4,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'בייקון',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 5,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: burgerIngredientsOption.id,
        name: 'פטריות',
        additionalPrice: 4.00,
        isDefault: false,
        sortOrder: 6,
      },
    }),
  ])

  // ערכי תוספת צד
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: sideDishOption.id,
        name: 'ללא תוספת',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: sideDishOption.id,
        name: 'ציפס',
        additionalPrice: 8.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: sideDishOption.id,
        name: 'סלט ירקות',
        additionalPrice: 6.00,
        isDefault: false,
        sortOrder: 3,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: sideDishOption.id,
        name: 'בטטה צלויה',
        additionalPrice: 7.00,
        isDefault: false,
        sortOrder: 4,
      },
    }),
  ])

  // ערכי משקה
  await Promise.all([
    prisma.productOptionValue.create({
      data: {
        productOptionId: drinkOption.id,
        name: 'ללא משקה',
        additionalPrice: 0,
        isDefault: true,
        sortOrder: 1,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: drinkOption.id,
        name: 'קולה',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 2,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: drinkOption.id,
        name: 'ספרייט',
        additionalPrice: 5.00,
        isDefault: false,
        sortOrder: 3,
      },
    }),
    prisma.productOptionValue.create({
      data: {
        productOptionId: drinkOption.id,
        name: 'מים',
        additionalPrice: 2.00,
        isDefault: false,
        sortOrder: 4,
      },
    }),
  ])

  // יצירת מוצרים נוספים
  const appetizersCategory = categories[2]
  const drinksCategory = categories[3]
  const dessertsCategory = categories[4]

  // מנות ראשונות
  await prisma.product.create({
    data: {
      categoryId: appetizersCategory.id,
      businessId: business.id,
      name: 'סלט קיסר',
      description: 'סלט קיסר עם חסה, קרוטונים, פרמזן ורוטב קיסר',
      basePrice: 25.00,
      image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=🥗',
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      categoryId: appetizersCategory.id,
      businessId: business.id,
      name: 'גבינה מטוגנת',
      description: 'חטיפי גבינה מטוגנים עם רוטב דבש',
      basePrice: 18.00,
      image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=🧀',
      sortOrder: 2,
    },
  })

  // משקאות
  await prisma.product.create({
    data: {
      categoryId: drinksCategory.id,
      businessId: business.id,
      name: 'קולה',
      description: 'קולה קרה 330 מ"ל',
      basePrice: 8.00,
      image: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=🥤',
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      categoryId: drinksCategory.id,
      businessId: business.id,
      name: 'קפה שחור',
      description: 'קפה שחור טרי',
      basePrice: 12.00,
      image: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=☕',
      sortOrder: 2,
    },
  })

  // קינוחים
  await prisma.product.create({
    data: {
      categoryId: dessertsCategory.id,
      businessId: business.id,
      name: 'עוגת שוקולד',
      description: 'עוגת שוקולד עשירה עם גלידה',
      basePrice: 22.00,
      image: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=🍰',
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      categoryId: dessertsCategory.id,
      businessId: business.id,
      name: 'גלידה',
      description: 'גלידה בטעם וניל, שוקולד או תות',
      basePrice: 15.00,
      image: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=🍦',
      sortOrder: 2,
    },
  })

  console.log('✅ מוצרים עם אפשרויות מתקדמות נוצרו')

  // יצירת לקוח לדוגמה
  const customer = await prisma.customer.create({
    data: {
      name: 'יוסי כהן',
      phone: '050-1234567',
      email: 'yossi@example.com',
      businessId: business.id,
    },
  })

  console.log('✅ לקוח לדוגמה נוצר:', customer.name)

  console.log('🎉 כל נתוני הדמו נוצרו בהצלחה!')
  console.log('📊 סיכום:')
  console.log(`   - עסק: ${business.name}`)
  console.log(`   - קטגוריות: ${categories.length}`)
  console.log(`   - מוצרים: 8 (עם אפשרויות מתקדמות)`)
  console.log(`   - משתמש אדמין: ${adminUser.email}`)
  console.log(`   - לקוח לדוגמה: ${customer.name}`)
  console.log('')
  console.log('🔗 קישורים:')
  console.log(`   - מסך הזמנות: http://localhost:3000/screen/${business.id}`)
  console.log(`   - אדמין: http://localhost:3000/admin/login`)
  console.log(`   - אימייל אדמין: ${adminUser.email}`)
  console.log(`   - סיסמה: admin123`)
}

main()
  .catch((e) => {
    console.error('❌ שגיאה ביצירת נתוני דמו:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 