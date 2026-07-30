import { prisma } from "@/lib/prisma";
import type {
  SaveCloudinaryMediaInput,
  SaveExternalLinkMediaInput,
} from "@/lib/validations/media";

import { cloudinary } from "@/lib/cloudinary";


export async function saveCloudinaryMedia(input: SaveCloudinaryMediaInput) {
  const existing = await prisma.lessonMedia.findUnique({
    where: { lessonId: input.lessonId },
  });

  if (
    existing?.provider === "cloudinary" &&
    existing.cloudinaryPublicId &&
    existing.cloudinaryPublicId !== input.cloudinaryPublicId
  ) {
    await deleteCloudinaryVideo(existing.cloudinaryPublicId);
  }

  return prisma.lessonMedia.upsert({
    where: { lessonId: input.lessonId },
    create: {
      lessonId: input.lessonId,
      provider: "cloudinary",
      cloudinaryPublicId: input.cloudinaryPublicId,
      cloudinaryResourceType: input.cloudinaryResourceType ?? "video",
      durationSeconds: input.durationSeconds ?? null,
      isReady: true,
    },
    update: {
      provider: "cloudinary",
      cloudinaryPublicId: input.cloudinaryPublicId,
      cloudinaryResourceType: input.cloudinaryResourceType ?? "video",
      durationSeconds: input.durationSeconds ?? null,
      isReady: true,
      externalUrl: null,
    },
  });
}

export async function saveExternalLinkMedia(input: SaveExternalLinkMediaInput) {
  const existing = await prisma.lessonMedia.findUnique({
    where: { lessonId: input.lessonId },
  });

  if (existing?.provider === "cloudinary" && existing.cloudinaryPublicId) {
    await deleteCloudinaryVideo(existing.cloudinaryPublicId);
  }

  return prisma.lessonMedia.upsert({
    where: { lessonId: input.lessonId },
    create: {
      lessonId: input.lessonId,
      provider: "external_link",
      externalUrl: input.externalUrl,
      isReady: true,
    },
    update: {
      provider: "external_link",
      externalUrl: input.externalUrl,
      isReady: true,
      cloudinaryPublicId: null,
      cloudinaryResourceType: null,
    },
  });
}

export async function deleteLessonMedia(lessonId: string) {
  const existing = await prisma.lessonMedia.findUnique({
    where: { lessonId },
  });

  if (existing?.provider === "cloudinary" && existing.cloudinaryPublicId) {
    await deleteCloudinaryVideo(existing.cloudinaryPublicId);
  }

  return prisma.lessonMedia.deleteMany({ where: { lessonId } });
}



async function deleteCloudinaryVideo(publicId: string) {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    type: "authenticated",
  });
}