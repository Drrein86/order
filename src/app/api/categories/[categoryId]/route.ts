import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'שם הקטגוריה נדרש'),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const { categoryId } = params;
    const body = await request.json();
    const validatedData = UpdateCategorySchema.parse(body);

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        order: validatedData.order,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הקטגוריה' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const { categoryId } = params;
    await prisma.category.delete({ where: { id: categoryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הקטגוריה' },
      { status: 500 }
    );
  }
} 