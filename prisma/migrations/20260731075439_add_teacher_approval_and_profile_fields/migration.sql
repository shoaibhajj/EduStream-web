-- CreateEnum
CREATE TYPE "TeacherApprovalStatus" AS ENUM ('not_applicable', 'pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "teacher_approval_status" "TeacherApprovalStatus" NOT NULL DEFAULT 'not_applicable';
