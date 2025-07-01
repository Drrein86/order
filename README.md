# 🍽️ מערכת מסך הזמנות חכם לעסקים

מערכת מתקדמת למסך הזמנות דיגיטלי לעסקי מזון, בנויה עם Next.js, TypeScript ו-Prisma.

## ✨ תכונות עיקריות

- 🖥️ **מסך הזמנות אינטראקטיבי** - ממוטב עבור מסכי מגע וטאבלטים
- 🏢 **ניהול מרובה עסקים** - כל עסק עם הנתונים והגדרות שלו
- 🎨 **עיצוב מותאם אישית** - צבעים, לוגו ווידאו רקע לכל עסק
- 🛒 **סל קניות חכם** - עם תוספות דינמיות ואפשרויות מתקדמות
- 📱 **שליחת הזמנות** - למייל, WhatsApp ומדפסת
- 👨‍💼 **מערכת ניהול מלאה** - Admin Panel עם הרשאות
- 🔒 **אבטחה מתקדמת** - NextAuth עם הצפנה מלאה
- 🚀 **ללא נתוני דמה** - כל הנתונים אמיתיים ממסד נתונים

## 🛠️ טכנולוגיות

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel + Railway
- **File Upload**: Multer + Sharp

## 📋 דרישות מערכת

- Node.js 18+
- PostgreSQL Database (Railway)
- Git
- Account ב-Vercel ו-Railway

## 🚀 התקנה מהירה

### 1. שכפול הפרויקט

\`\`\`bash
git clone <your-repo-url>
cd order
npm install
\`\`\`

### 2. הגדרת מסד נתונים ב-Railway

1. הכנס ל-[Railway](https://railway.app)
2. צור פרויקט חדש
3. הוסף PostgreSQL Database
4. העתק את ה-DATABASE_URL

### 3. הגדרת משתני סביבה

צור קובץ \`.env\` בתיקיית הפרויקט:

\`\`\`env

# Database - Railway PostgreSQL

DATABASE_URL="postgresql://username:password@hostname:port/database_name"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-very-long-secret-key-minimum-32-characters"

# Email Settings (Gmail)

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-business@example.com"

# WhatsApp (Optional)

WHATSAPP_API_URL="https://api.whatsapp.com"
WHATSAPP_TOKEN="your-whatsapp-token"

# File Upload

UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880

# Environment

NODE_ENV="development"
\`\`\`

### 4. הגדרת מסד הנתונים

\`\`\`bash

# יצירת טבלאות

npx prisma migrate dev --name init

# יצירת Prisma Client

npx prisma generate
\`\`\`

### 5. הרצה מקומית

\`\`\`bash
npm run dev
\`\`\`

האתר יהיה זמין ב: http://localhost:3000

## 🌐 פריסה ל-Production

### 1. חיבור ל-Vercel

\`\`\`bash

# התקן Vercel CLI

npm i -g vercel

# התחבר לחשבון

vercel login

# פרוס לראשונה

vercel

# הגדר משתני סביבה ב-Vercel Dashboard

\`\`\`

### 2. הגדרת משתני סביבה ב-Vercel

ב-Vercel Dashboard:

- Project Settings → Environment Variables
- הוסף את כל המשתנים מקובץ ה-.env
- **חשוב**: שנה NEXTAUTH_URL לכתובת הייצור

### 3. הגדרת Database ב-Railway

\`\`\`bash

# רץ migrations ב-production database

npx prisma migrate deploy
\`\`\`

## 📊 מבנה מסד הנתונים

המערכת כוללת:

- **businesses** - עסקים
- **business_users** - משתמשי ניהול
- **business_settings** - הגדרות עסק
- **categories** - קטגוריות מוצרים
- **products** - מוצרים
- **product_options** - תוספות ואפשרויות
- **customers** - לקוחות
- **orders** - הזמנות
- **order_items** - פריטים בהזמנה

## 🎯 השימוש הראשון

### 1. יצירת עסק ראשון

אחרי הרצה ראשונה:

1. גש ל-`/admin/setup`
2. צור עסק ומשתמש ראשון
3. הגדר קטגוריות ומוצרים
4. התאם עיצוב וצבעים

### 2. הגדרת מסך הזמנות

1. גש ל-`/screen/[businessId]`
2. המסך יטען את תפריט העסק
3. הגדר על מסך/טאבלט במקום העסק

## 🔧 פיתוח ותחזוקה

### פקודות שימושיות

\`\`\`bash

# הרצה מקומית

npm run dev

# בניה ל-production

npm run build

# בדיקת קוד

npm run lint

# עבודה עם Database

npx prisma studio # UI לניהול DB
npx prisma migrate dev # יצירת migration חדש
npx prisma generate # עדכון Prisma Client
npx prisma db push # דחיפת שינויים לDB
\`\`\`

### מבנה תיקיות

\`\`\`
src/
├── app/ # App Router pages
├── components/ # React components
├── lib/ # Utilities ו-configurations
├── generated/ # Prisma Client
└── types/ # TypeScript definitions

prisma/
└── schema.prisma # Database schema
\`\`\`

## 🔐 אבטחה

- ✅ NextAuth.js לאוטנטיקציה
- ✅ הצפנת סיסמאות עם bcrypt
- ✅ הגנה על API routes
- ✅ הגנה על משתני סביבה
- ✅ Validation עם Zod
- ✅ CSRF Protection

## 📞 תמיכה ויצירת קשר

לבעיות טכניות או תמיכה:

- פתח Issue ב-GitHub
- בדוק תיעוד טכני ב-Wiki
- קרא FAQ במדריך המשתמש

## 📝 רישיון

המערכת פותחה לשימוש עסקי. יש לוודא עמידה בתנאי השימוש.

---

**מערכת פותחה עם ❤️ למסעדות ועסקי מזון**
