import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "הקובץ חייב להיות תמונה" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "גודל הקובץ חייב להיות פחות מ-5MB" },
        { status: 400 }
      );
    }

    // שמירה פיזית בשרת
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const fileName = `category-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/categories/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "התמונה הועלתה בהצלחה"
    });
  } catch (error) {
    console.error("Error uploading category image:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת התמונה" },
      { status: 500 }
    );
  }
} 