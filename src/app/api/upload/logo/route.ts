import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("logo") as File;

    if (!file) {
      return NextResponse.json(
        { error: "לא נמצא קובץ לוגו" },
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

    // כאן תהיה הלוגיקה להעלאה לשרת קבצים
    // כרגע נחזיר URL לדוגמה
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const logoUrl = `https://example.com/uploads/${fileName}`;

    // סימולציה של העלאה
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      url: logoUrl,
      message: "הלוגו הועלה בהצלחה"
    });

  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת הלוגו" },
      { status: 500 }
    );
  }
} 