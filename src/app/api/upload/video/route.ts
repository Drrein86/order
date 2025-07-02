import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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
        { error: "הקובץ גדול מדי. הגודל המקסימלי הוא 50MB" },
        { status: 400 }
      );
    }

    // יצירת תיקיית uploads אם לא קיימת
    const uploadsDir = join(process.cwd(), "public", "uploads", "videos");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // יצירת שם קובץ ייחודי
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const fileName = `video_${timestamp}_${randomString}.${extension}`;
    const filePath = join(uploadsDir, fileName);

    // המרת הקובץ ל-Buffer ושמירה
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // החזרת URL של הקובץ
    const fileUrl = `/uploads/videos/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת הוידאו" },
      { status: 500 }
    );
  }
} 