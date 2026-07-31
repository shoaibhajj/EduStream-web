-- CreateEnum
CREATE TYPE "PaymentRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PaymentRequestType" AS ENUM ('course', 'subscription');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "has_active_subscription" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "payment_configs" (
    "id" TEXT NOT NULL,
    "instructions_ar" TEXT,
    "instructions_en" TEXT,
    "sham_cash_qr_image_url" TEXT,
    "sham_cash_whatsapp_number" TEXT,
    "sham_cash_instructions_ar" TEXT,
    "sham_cash_instructions_en" TEXT,
    "show_teacher_details_to_students" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_payment_details" (
    "id" TEXT NOT NULL,
    "teacher_clerk_id" TEXT NOT NULL,
    "details_ar" TEXT,
    "details_en" TEXT,
    "whatsapp_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_payment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_requests" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "status" "PaymentRequestStatus" NOT NULL DEFAULT 'pending',
    "request_type" "PaymentRequestType" NOT NULL,
    "course_id" TEXT,
    "phone_number" TEXT NOT NULL,
    "payment_reference" TEXT NOT NULL,
    "admin_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_payment_details_teacher_clerk_id_key" ON "teacher_payment_details"("teacher_clerk_id");

-- CreateIndex
CREATE INDEX "payment_requests_profile_id_idx" ON "payment_requests"("profile_id");

-- CreateIndex
CREATE INDEX "payment_requests_course_id_idx" ON "payment_requests"("course_id");

-- CreateIndex
CREATE INDEX "payment_requests_status_idx" ON "payment_requests"("status");

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
