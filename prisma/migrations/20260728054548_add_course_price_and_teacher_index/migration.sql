-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "courses_teacher_id_idx" ON "courses"("teacher_id");
