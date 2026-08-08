-- AlterEnum
ALTER TYPE "MediaProvider" ADD VALUE 'dailymotion';

-- AlterTable
ALTER TABLE "lesson_media" ADD COLUMN     "dailymotion_private_id" TEXT,
ADD COLUMN     "dailymotion_video_id" TEXT;
