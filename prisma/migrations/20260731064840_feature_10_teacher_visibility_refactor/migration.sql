/*
  Warnings:

  - You are about to drop the column `show_teacher_details_to_students` on the `payment_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_configs" DROP COLUMN "show_teacher_details_to_students";

-- AlterTable
ALTER TABLE "teacher_payment_details" ADD COLUMN     "is_visible_to_students" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qr_image_url" TEXT;
