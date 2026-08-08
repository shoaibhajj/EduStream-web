import { prisma } from "@/lib/prisma";

export type SaveDailymotionMediaInput = {
  lessonId: string;
  dailymotionVideoId: string;
  dailymotionPrivateId?: string;
  durationSeconds?: number;
};

export async function saveDailymotionMedia(data: {
  lessonId: string;
  dailymotionVideoId: string;
  dailymotionPrivateId?: string;
  durationSeconds?: number;
  isReady: boolean;
}) {
  await prisma.lessonMedia.upsert({
    where: { lessonId: data.lessonId },
    create: {
      lessonId: data.lessonId,
      provider: "dailymotion",
      dailymotionVideoId: data.dailymotionVideoId,
      dailymotionPrivateId: data.dailymotionPrivateId ?? null,
      durationSeconds: data.durationSeconds ?? null,
      cloudinaryPublicId: null,
      cloudinaryResourceType: "video",
      externalUrl: null,
      isReady: data.isReady,
    },
    update: {
      provider: "dailymotion",
      dailymotionVideoId: data.dailymotionVideoId,
      dailymotionPrivateId: data.dailymotionPrivateId ?? null,
      durationSeconds: data.durationSeconds ?? null,
      cloudinaryPublicId: null,
      cloudinaryResourceType: "video",
      externalUrl: null,
      isReady: data.isReady,
    },
  });
}