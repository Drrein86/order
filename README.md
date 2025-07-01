# 🍽️ מערכת הזמנות חכמה לעסקי מזון

## 📱 מסך הזמנות דיגיטלי מתקדם עם Admin Panel מלא

מערכת הזמנות מקצועית הבנויה עם Next.js 15, Prisma, PostgreSQL ו-NextAuth.js עם תמיכה מלאה בעברית וממשק משתמש מתקדם.

---

## 🚀 פיצ'רים עיקריים

### 🛍️ מסך הזמנות לקוחות

- ✅ מסך ברוכים הבאים עם וידאו רקע
- ✅ בחירת סוג הזמנה (שבת במקום / טייקאווי)
- ✅ עיון בקטגוריות ומוצרים
- ✅ תוספות דינמיות (גדלים, רמות צלייה, תוספות)
- ✅ סל קניות מתקדם עם עריכה
- ✅ טופס לקוח ושליחת הזמנה
- ✅ חיווי מחירים בזמן אמת

### 👨‍💼 Admin Panel מלא

- ✅ **Dashboard** - לוח בקרה עם סטטיסטיקות
- ✅ **ניהול מוצרים** - הוספה, עריכה, מחיקה עם פילטרים
- ✅ **ניהול הזמנות** - עדכון סטטוס בזמן אמת
- ✅ **ניהול קטגוריות** - ארגון המוצרים
- ✅ **הגדרות מתקדמות** - עיצוב, התראות, הגדרות עסק
- ✅ מערכת התחברות בטוחה
- ✅ הרשאות והגנת routes

### 🗄️ מסד נתונים מתקדם

- ✅ PostgreSQL על Railway
- ✅ 12 טבלאות מקצועיות
- ✅ קשרים מורכבים בין טבלאות
- ✅ מערכת אבטחה והרשאות
- ✅ נתוני דמו מוכנים

### 🔧 אוטומציה ואינטגרציות

- ✅ שליחת הזמנות למייל
- ✅ אינטגרציה עם WhatsApp
- ✅ הדפסה אוטומטית
- ✅ התראות בזמן אמת

---

## 🛠️ טכנולוגיות

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL (Railway), Prisma ORM
- **Deployment**: Vercel
- **Styling**: Tailwind CSS, RTL Support
- **Authentication**: NextAuth.js + Credentials Provider

---

## 📦 התקנה מקומית

### דרישות מוקדמות

- Node.js 18+
- npm או yarn
- Git

### שלבי התקנה

1. **שכפול הפרויקט**
   \`\`\`bash
   git clone <repository-url>
   cd order
   \`\`\`

2. **התקנת תלויות**
   \`\`\`bash
   npm install
   \`\`\`

3. **הגדרת משתני סביבה**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   ערוך את קובץ `.env` עם הפרטים שלך:
   \`\`\`
   DATABASE_URL="postgresql://username:password@hostname:port/database"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   \`\`\`

4. **הגדרת מסד נתונים**
   \`\`\`bash
   npx prisma migrate dev
   npx prisma generate
   \`\`\`

5. **יצירת נתוני דמו**
   \`\`\`bash
   npx tsx scripts/seed.ts
   \`\`\`

6. **הפעלת השרת**
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 🌍 פריסה ל-Vercel

### שלב 1: הכנת הפרויקט

\`\`\`bash

# וודא שהכל עובד מקומית

npm run build
npm run start

# העלה לגיט

git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### שלב 2: יצירת פרויקט ב-Vercel

1. היכנס ל[Vercel](https://vercel.com)
2. לחץ "Import Project"
3. בחר את הריפוזיטורי
4. Vercel יזהה אוטומטית שזה פרויקט Next.js

### שלב 3: הגדרת משתני סביבה ב-Vercel

ב**Settings > Environment Variables** הוסף:
\`\`\`
DATABASE_URL = <Railway PostgreSQL URL>
NEXTAUTH_SECRET = <your-secret-64-chars>
NEXTAUTH_URL = https://your-app.vercel.app
\`\`\`

### שלב 4: Deploy

לחץ **Deploy** והמתן לסיום הבנייה.

---

## 🗄️ הגדרת Railway Database

### יצירת מסד נתונים

1. היכנס ל[Railway](https://railway.app)
2. צור פרויקט חדש
3. הוסף PostgreSQL service
4. העתק את ה-DATABASE_URL

### הגדרת חיבור

\`\`\`bash

# הרץ מיגרציות על הפרודקשן

DATABASE_URL="<railway-url>" npx prisma migrate deploy
DATABASE_URL="<railway-url>" npx prisma generate
\`\`\`

---

## 📋 פרטי כניסה

### 🛍️ מסך לקוחות

- **URL**: `/screen/[businessId]`
- **גישה**: פתוח לכלל הציבור

### 👨‍💼 Admin Panel

- **URL**: `/admin/login`
- **אימיל**: `admin@restaurant.com`
- **סיסמה**: `123456`

---

## 🎯 קישורים זמינים

### בפיתוח (localhost:3000)

- 🏠 **דף הבית**: [http://localhost:3000](http://localhost:3000)
- 🛍️ **מסך הזמנות**: [http://localhost:3000/screen/{businessId}](http://localhost:3000/screen/cmckqidpo0000vqzw503br23a)
- 👨‍💼 **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- 📊 **Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

### בפרודקשן (אחרי פריסה)

- 🌍 **Your Domain**: `https://your-app.vercel.app`
- 🛍️ **Customer Screen**: `https://your-app.vercel.app/screen/{businessId}`
- 👨‍💼 **Admin**: `https://your-app.vercel.app/admin/login`

---

## 🔧 פקודות שימושיות

\`\`\`bash

# פיתוח

npm run dev # הפעלת שרת פיתוח
npm run build # בניית פרודקשן
npm run start # הפעלת שרת פרודקשן
npm run lint # בדיקת קוד

# מסד נתונים

npx prisma studio # ממשק גרפי למסד נתונים
npx prisma migrate dev # יצירת מיגרציה חדשה
npx prisma generate # יצירת Prisma Client
npx tsx scripts/seed.ts # הרצת נתוני דמו

# כלים

npm run type-check # בדיקת TypeScript
\`\`\`

---

## 📁 מבנה פרויקט

\`\`\`
order/
├── prisma/
│ ├── schema.prisma # סכמת מסד נתונים
│ └── migrations/ # מיגרציות
├── src/
│ ├── app/
│ │ ├── api/ # API Routes
│ │ ├── admin/ # Admin Panel
│ │ ├── screen/ # Customer Screens
│ │ └── page.tsx # דף הבית
│ ├── components/
│ │ └── ordering/ # קומפוננטים להזמנות
│ ├── lib/
│ │ ├── db.ts # Prisma Client
│ │ ├── types.ts # טיפוסי TypeScript
│ │ └── utils.ts # פונקציות עזר
│ └── types/ # הגדרות טיפוסים
├── scripts/
│ └── seed.ts # נתוני דמו
├── vercel.json # הגדרות Vercel
└── README.md # תיעוד זה
\`\`\`

---

## 🎨 קסטמיזציה

### שינוי צבעים

ערוך את הקובץ `src/app/globals.css`:
\`\`\`css
:root {
--primary-color: #3B82F6; /_ כחול _/
--secondary-color: #F59E0B; /_ כתום _/
--accent-color: #10B981; /_ ירוק _/
}
\`\`\`

### הוספת לוגו

1. העלה תמונה לתיקיית `public/`
2. עדכן את הקומפוננט `WelcomeScreen.tsx`

### שינוי וידאו רקע

עדכן את ה-URL בהגדרות Admin Panel או ישירות בקומפוננט.

---

## 🔧 פתרון בעיות נפוצות

### בעיית חיבור למסד נתונים

\`\`\`bash

# בדוק את ה-DATABASE_URL

echo $DATABASE_URL

# הרץ מיגרציות מחדש

npx prisma migrate reset
npx prisma migrate dev
\`\`\`

### שגיאות TypeScript

\`\`\`bash

# נקה ובנה מחדש

rm -rf .next
npm run build
\`\`\`

### בעיות עם NextAuth

\`\`\`bash

# וודא שה-NEXTAUTH_SECRET מוגדר

echo $NEXTAUTH_SECRET

# צור מפתח חדש אם צריך

openssl rand -base64 32
\`\`\`

---

## 📞 תמיכה

### 💡 עצות לשימוש

- השתמש ב-Prisma Studio לצפייה בנתונים
- בדוק את ה-console לשגיאות JavaScript
- ההזמנות נשמרות במסד הנתונים האמיתי
- כל עסק מקבל את הנתונים שלו בלבד

### 🐛 דיווח על באגים

1. בדוק את ה-console בדפדפן
2. בדוק את לוגי השרת
3. וודא שמשתני הסביבה מוגדרים נכון

---

## 📈 שדרוגים עתידיים

- [ ] אפליקציית מובייל (React Native)
- [ ] מערכת נאמנות לקוחות
- [ ] אנליטיקס מתקדם
- [ ] אינטגרציה עם כרטיסי אשראי
- [ ] מערכת מלאי אוטומטית
- [ ] דוחות מכירות מתקדמים

---

## 📄 רישיון

פרויקט פרטי - כל הזכויות שמורות.

---

**🚀 מערכת הזמנות חכמה - מוכנה לשימוש מיידי!**
