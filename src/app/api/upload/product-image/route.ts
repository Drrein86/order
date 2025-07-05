import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "לא נמצא קובץ תמונה" },
        { status: 400 }
      );
    }

    // בדיקת סוג הקובץ
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "הקובץ חייב להיות תמונה" },
        { status: 400 }
      );
    }

    // בדיקת גודל הקובץ (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "גודל הקובץ חייב להיות פחות מ-5MB" },
        { status: 400 }
      );
    }

    // יצירת שם קובץ ייחודי
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `product-${timestamp}.${fileExtension}`;
    
    // המרת הקובץ ל-Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // שמירת הקובץ בתיקיית public/uploads
    const fs = require('fs');
    const path = require('path');
    
    // יצירת תיקיית uploads אם לא קיימת
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);
    
    // יצירת URL יחסי
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "התמונה הועלתה בהצלחה"
    });

  } catch (error) {
    console.error("Error uploading product image:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת התמונה" },
      { status: 500 }
    );
  }
} 