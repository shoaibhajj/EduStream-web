-- CreateEnum
CREATE TYPE "MediaProvider" AS ENUM ('cloudinary', 'external_link', 'backblaze_b2');

-- CreateTable
CREATE TABLE "lesson_media" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "provider" "MediaProvider" NOT NULL,
    "cloudinary_public_id" TEXT,
    "cloudinary_resource_type" TEXT DEFAULT 'video',
    "external_url" TEXT,
    "duration_seconds" INTEGER,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_media_lesson_id_key" ON "lesson_media"("lesson_id");

-- CreateIndex
CREATE INDEX "lesson_media_lesson_id_idx" ON "lesson_media"("lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_media" ADD CONSTRAINT "lesson_media_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
