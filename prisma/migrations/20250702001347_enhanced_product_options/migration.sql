/*
  Warnings:

  - The values [SUPER_ADMIN,ADMIN,VIEWER,CHEF] on the enum `BusinessUserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [SIZE_SELECTION] on the enum `ProductOptionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `details` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `product_option_values` table. All the data in the column will be lost.
  - You are about to drop the column `maxSelections` on the `product_options` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `product_options` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `business_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessUserId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessUserRole_new" AS ENUM ('OWNER', 'MANAGER', 'STAFF');
ALTER TABLE "business_users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "business_users" ALTER COLUMN "role" TYPE "BusinessUserRole_new" USING ("role"::text::"BusinessUserRole_new");
ALTER TYPE "BusinessUserRole" RENAME TO "BusinessUserRole_old";
ALTER TYPE "BusinessUserRole_new" RENAME TO "BusinessUserRole";
DROP TYPE "BusinessUserRole_old";
ALTER TABLE "business_users" ALTER COLUMN "role" SET DEFAULT 'STAFF';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductOptionType_new" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT_INPUT', 'QUANTITY', 'HALF_AND_HALF');
ALTER TABLE "product_options" ALTER COLUMN "type" TYPE "ProductOptionType_new" USING ("type"::text::"ProductOptionType_new");
ALTER TYPE "ProductOptionType" RENAME TO "ProductOptionType_old";
ALTER TYPE "ProductOptionType_new" RENAME TO "ProductOptionType";
DROP TYPE "ProductOptionType_old";
COMMIT;

-- DropIndex
DROP INDEX "business_users_businessId_email_key";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "details",
DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "businessUserId" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "newData" JSONB,
ADD COLUMN     "oldData" JSONB;

-- AlterTable
ALTER TABLE "business_users" ALTER COLUMN "role" SET DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "businessId" TEXT;

-- AlterTable
ALTER TABLE "order_item_options" ADD COLUMN     "halfPosition" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "product_option_values" DROP COLUMN "order",
ADD COLUMN     "halfPosition" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product_options" DROP COLUMN "maxSelections",
DROP COLUMN "order",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isHalfOption" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "type" SET DEFAULT 'SINGLE_CHOICE';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "order",
ADD COLUMN     "basePrice" DOUBLE PRECISION,
ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "business_users_email_key" ON "business_users"("email");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "product_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_businessUserId_fkey" FOREIGN KEY ("businessUserId") REFERENCES "business_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
