import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { error: "לא נמצא קובץ וידאו" },
        { status: 400 }
      );
    }

    // בדיקת סוג הקובץ
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "הקובץ חייב להיות וידאו" },
        { status: 400 }
      );
    }

    // בדיקת גודל הקובץ (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "גודל הקובץ חייב להיות פחות מ-50MB" },
        { status: 400 }
      );
    }

    // כאן תהיה הלוגיקה להעלאה לשרת קבצים
    // כרגע נחזיר URL לדוגמה
    const fileName = `video-${Date.now()}.mp4`;
    const videoUrl = `https://example.com/uploads/${fileName}`;

    // סימולציה של העלאה
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      url: videoUrl,
      message: "הוידאו הועלה בהצלחה"
    });

  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת הוידאו" },
      { status: 500 }
    );
  }
} 