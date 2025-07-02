# 🚀 מדריך מהיר לעלייה ל-Vercel

## שלבים מהירים לעלייה לייצור

### 1. הכנת הפרויקט

```bash
# וודא שהכל עובד
npm run build

# העלה לגיט
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. יצירת פרויקט ב-Vercel

1. היכנס ל [Vercel](https://vercel.com)
2. לחץ "New Project"
3. בחר את הריפוזיטורי שלך
4. Vercel יזהה אוטומטית שזה Next.js

### 3. הגדרת משתני סביבה

ב-Vercel Dashboard > Settings > Environment Variables הוסף:

```
DATABASE_URL = <Railway PostgreSQL URL>
NEXTAUTH_SECRET = <your-secret-key>
NEXTAUTH_URL = https://your-app.vercel.app
```

### 4. הגדרת מסד נתונים

```bash
# הרץ מיגרציות
DATABASE_URL="<railway-url>" npx prisma migrate deploy

# יצירת נתוני דמו
DATABASE_URL="<railway-url>" npx tsx scripts/seed.ts
```

### 5. Deploy!

לחץ "Deploy" ב-Vercel והמתן לסיום הבנייה.

## 🔗 קישורים חשובים

- **Admin Panel**: `https://your-app.vercel.app/admin/login`
- **מסך לקוחות**: `https://your-app.vercel.app/screen/{businessId}`
- **פרטי כניסה**: admin@restaurant.com / admin123

## ✅ בדיקות אחרי העלייה

1. בדוק שהדף הראשי נטען
2. בדוק כניסה ל-Admin Panel
3. בדוק מסך הזמנות
4. בדוק ניהול מוצרים וקטגוריות
5. בדוק יצירת הזמנה חדשה

## 🆘 פתרון בעיות

### שגיאת מסד נתונים

```bash
# בדוק חיבור למסד נתונים
DATABASE_URL="<railway-url>" npx prisma db pull
```

### שגיאת NextAuth

- וודא שה-NEXTAUTH_SECRET מוגדר
- וודא שה-NEXTAUTH_URL נכון

### שגיאת בנייה

- בדוק שה-Node.js version תואם (18+)
- בדוק שכל התלויות מותקנות
