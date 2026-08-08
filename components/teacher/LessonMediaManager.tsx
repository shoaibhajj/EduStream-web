"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  saveCloudinaryMediaAction,
  saveExternalLinkMediaAction,
  saveDailymotionLinkAction,
  saveDailymotionUploadAction,
} from "@/actions/media";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialogDeleteButton } from "@/components/teacher/AlertDialogDeleteButton";

type ExistingMedia = {
  provider: "cloudinary" | "external_link" | "backblaze_b2" | "dailymotion";
  cloudinaryPublicId: string | null;
  dailymotionVideoId: string | null;
  externalUrl: string | null;
  isReady: boolean;
} | null;

type Props = {
  lessonId: string;
  courseId: string;
  existingMedia: ExistingMedia;
  previewUrl: string | null;
  locale: string;
};

type UploadProgressState = {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  speedBps: number;
  etaSeconds: number | null;
};

type CloudinaryUploadResponse = {
  public_id: string;
  duration?: number;
};

type CloudinaryUploadErrorResponse = {
  error?: {
    message?: string;
  };
};

type SourceTypeTab =
  | "cloudinary"
  | "dailymotion_upload"
  | "dailymotion_link"
  | "external_link";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatEta(
  seconds: number | null,
  t: ReturnType<typeof useTranslations>
) {
  if (seconds == null || !Number.isFinite(seconds))
    return t("uploadEtaCalculating");
  if (seconds < 60) return t("uploadEtaSeconds", { count: Math.ceil(seconds) });

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  if (minutes < 60) {
    return t("uploadEtaMinutesSeconds", {
      minutes,
      seconds: remainingSeconds,
    });
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return t("uploadEtaHoursMinutes", {
    hours,
    minutes: remainingMinutes,
  });
}

export function LessonMediaManager({
  lessonId,
  courseId,
  existingMedia,
  previewUrl,
  locale,
}: Props) {
  const t = useTranslations("LessonMedia");
  const router = useRouter();
  const dmXhrRef = useRef<XMLHttpRequest | null>(null);
  const [sourceType, setSourceType] = useState<SourceTypeTab>(
    existingMedia?.provider === "external_link"
      ? "external_link"
      : existingMedia?.provider === "dailymotion"
      ? "dailymotion_link"
      : "cloudinary"
  );

  const [externalUrl, setExternalUrl] = useState(
    existingMedia?.externalUrl ?? ""
  );
  const [dmLinkInput, setDmLinkInput] = useState(
    existingMedia?.provider === "dailymotion" &&
      existingMedia?.dailymotionVideoId
      ? `https://www.dailymotion.com/video/${existingMedia.dailymotionVideoId}`
      : ""
  );

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dmUploadFile, setDmUploadFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    progress: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    speedBps: 0,
    etaSeconds: null,
  });

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const speedText = useMemo(() => {
    if (!uploadProgress.speedBps) return `0 ${t("uploadSpeedUnit")}`;
    return `${formatBytes(uploadProgress.speedBps)}/${t("uploadSpeedUnit")}`;
  }, [uploadProgress.speedBps, t]);

  async function handleCloudinaryUploadAndSave() {
    if (!uploadFile) return;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    setUploadProgress({
      progress: 0,
      uploadedBytes: 0,
      totalBytes: uploadFile.size,
      speedBps: 0,
      etaSeconds: null,
    });

    try {
      const sigRes = await fetch("/api/cloudinary/upload-signature");
      if (!sigRes.ok) throw new Error("signature_failed");

      const { signature, timestamp, cloudName, apiKey, folder, type } =
        await sigRes.json();

      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("folder", folder);
      fd.append("resource_type", "video");
      fd.append("type", type);

      const uploadData = await new Promise<CloudinaryUploadResponse>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;

          const startedAt = Date.now();

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
            true
          );

          xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;

            const uploadedBytes = event.loaded;
            const totalBytes = event.total;
            const progress = Math.round((uploadedBytes / totalBytes) * 100);

            const elapsedSeconds = (Date.now() - startedAt) / 1000;
            const speedBps =
              elapsedSeconds > 0 ? uploadedBytes / elapsedSeconds : 0;
            const remainingBytes = totalBytes - uploadedBytes;
            const etaSeconds = speedBps > 0 ? remainingBytes / speedBps : null;

            setUploadProgress({
              progress,
              uploadedBytes,
              totalBytes,
              speedBps,
              etaSeconds,
            });
          };

          xhr.onload = () => {
            try {
              if (xhr.status >= 200 && xhr.status < 300) {
                const json = JSON.parse(
                  xhr.responseText
                ) as CloudinaryUploadResponse;
                resolve(json);
              } else {
                const errorJson = JSON.parse(
                  xhr.responseText
                ) as CloudinaryUploadErrorResponse;
                reject(new Error(errorJson.error?.message || "upload_failed"));
              }
            } catch {
              reject(new Error("upload_failed"));
            }
          };

          xhr.onerror = () => reject(new Error("upload_failed"));
          xhr.onabort = () => reject(new Error("upload_cancelled"));

          xhr.send(fd);
        }
      );

      const saveForm = new FormData();
      saveForm.append("lessonId", lessonId);
      saveForm.append("cloudinaryPublicId", uploadData.public_id);
      saveForm.append("cloudinaryResourceType", "video");

      if (uploadData.duration) {
        saveForm.append(
          "durationSeconds",
          String(Math.round(uploadData.duration))
        );
      }

      const result = await saveCloudinaryMediaAction(saveForm);
      if (result.error) throw new Error(result.error);

      setUploadFile(null);
      setUploadSuccess(true);
      setUploadProgress((prev) => ({
        ...prev,
        progress: 100,
        uploadedBytes: prev.totalBytes,
        etaSeconds: 0,
      }));

      toast.success(t("successSave"));
      router.refresh();
    } catch (err) {
      console.error("[LessonMediaManager] cloudinary upload failed", err);

      if (err instanceof Error && err.message === "upload_cancelled") {
        setUploadError(t("errorUploadCancelled"));
      } else {
        setUploadError(t("errorUpload"));
      }
    } finally {
      setIsUploading(false);
      xhrRef.current = null;
    }
  }

  async function handleDailymotionUpload() {
    if (!dmUploadFile) return;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    setUploadProgress({
      progress: 0,
      uploadedBytes: 0,
      totalBytes: dmUploadFile.size,
      speedBps: 0,
      etaSeconds: null,
    });

    try {
     const uploadData = await new Promise<{
       videoId: string;
       privateId?: string | null;
       durationSeconds?: number | null;
       ready?: boolean | null;
       status?: string | null;
       encodingProgress?: number | null;
       publishingProgress?: number | null;
       statusCode?: string | null;
       statusTitle?: string | null;
       statusMessage?: string | null;
     }>((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       dmXhrRef.current = xhr;

       const startedAt = Date.now();
       const fd = new FormData();
       fd.append("file", dmUploadFile);

       xhr.open("POST", "/api/dailymotion/upload", true);

       xhr.upload.onprogress = (event) => {
         if (!event.lengthComputable) return;

         const uploadedBytes = event.loaded;
         const totalBytes = event.total;
         const progress = Math.round((uploadedBytes / totalBytes) * 100);

         const elapsedSeconds = (Date.now() - startedAt) / 1000;
         const speedBps =
           elapsedSeconds > 0 ? uploadedBytes / elapsedSeconds : 0;
         const remainingBytes = totalBytes - uploadedBytes;
         const etaSeconds = speedBps > 0 ? remainingBytes / speedBps : null;

         setUploadProgress({
           progress,
           uploadedBytes,
           totalBytes,
           speedBps,
           etaSeconds,
         });
       };

       xhr.onload = () => {
         try {
           const json = JSON.parse(xhr.responseText) as {
             videoId?: string;
             privateId?: string | null;
             durationSeconds?: number | null;
             error?: string;
             detail?: string;
             ready?: boolean | null;
             status?: string | null;
             encodingProgress?: number | null;
             publishingProgress?: number | null;
             statusCode?: string | null;
             statusTitle?: string | null;
             statusMessage?: string | null;
           };

           if (xhr.status >= 200 && xhr.status < 300 && json.videoId) {
            resolve({
              videoId: json.videoId,
              privateId: json.privateId ?? null,
              durationSeconds: json.durationSeconds ?? null,
              ready: json.ready ?? null,
              status: json.status ?? null,
              encodingProgress: json.encodingProgress ?? null,
              publishingProgress: json.publishingProgress ?? null,
              statusCode: json.statusCode ?? null,
              statusTitle: json.statusTitle ?? null,
              statusMessage: json.statusMessage ?? null,
            });
           } else {
             reject(new Error(json.detail || json.error || "dm_upload_failed"));
           }
         } catch {
           reject(new Error("dm_upload_failed"));
         }
       };

       xhr.onerror = () => reject(new Error("dm_upload_failed"));
       xhr.onabort = () => reject(new Error("upload_cancelled"));

       xhr.send(fd);
     });

      const saveForm = new FormData();
      saveForm.append("lessonId", lessonId);
      saveForm.append("dailymotionVideoId", uploadData.videoId);

      if (uploadData.privateId) {
        saveForm.append("dailymotionPrivateId", uploadData.privateId);
      }

      if (uploadData.durationSeconds) {
        saveForm.append("durationSeconds", String(uploadData.durationSeconds));
      }
      saveForm.append("isReady", String(!!uploadData.ready));

      const result = await saveDailymotionUploadAction(saveForm);
      if (result.error) throw new Error(result.error);

    if (!uploadData.ready) {
      setUploadSuccess(false);

      const progressValue =
        uploadData.publishingProgress ?? uploadData.encodingProgress;

      const message =
        progressValue !== null && progressValue !== undefined
          ? t("dailymotionProcessingWithProgress", {
              progress: progressValue,
            })
          : uploadData.statusMessage || t("dailymotionProcessing");

      setUploadError(message);
      router.refresh();
      return;
    }

      setDmUploadFile(null);
      setUploadSuccess(true);
      setUploadProgress((prev) => ({
        ...prev,
        progress: 100,
        uploadedBytes: prev.totalBytes,
        etaSeconds: 0,
      }));

      toast.success(t("successSave"));
      router.refresh();
    } catch (err) {
      console.error("[LessonMediaManager] dailymotion upload failed", err);

      if (err instanceof Error && err.message === "upload_cancelled") {
        setUploadError(t("errorUploadCancelled"));
      } else {
        setUploadError(t("errorDailymotionUpload"));
      }
    } finally {
      setIsUploading(false);
      dmXhrRef.current = null;
    }
  }

  function handleCancelUpload() {
    xhrRef.current?.abort();
    dmXhrRef.current?.abort();
  }

  function handleExternalSave(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);

    const fd = new FormData();
    fd.append("lessonId", lessonId);
    fd.append("externalUrl", externalUrl);

    startTransition(async () => {
      const result = await saveExternalLinkMediaAction(fd);
      if (result.error) {
        setUploadError(
          result.error === "unsupported_url"
            ? t("errorUnsupportedExternalUrl")
            : t("errorSave")
        );
      } else {
        setUploadSuccess(true);
        toast.success(t("successSave"));
        router.refresh();
      }
    });
  }

  function handleDailymotionLinkSave(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);

    const fd = new FormData();
    fd.append("lessonId", lessonId);
    fd.append("rawInput", dmLinkInput);

    startTransition(async () => {
      const result = await saveDailymotionLinkAction(fd);

      if (result.error) {
        setUploadError(
          result.error === "invalid_dailymotion_input"
            ? t("errorInvalidDailymotionInput")
            : t("errorSave")
        );
      } else {
        setUploadSuccess(true);
        toast.success(t("successSave"));
        router.refresh();
      }
    });
  }


async function refreshDailymotionStatus() {
  try {
    let lastData: {
      ready?: boolean;
      publishingProgress?: number | null;
      encodingProgress?: number | null;
      statusMessage?: string | null;
    } | null = null;

    for (let i = 0; i < 12; i++) {
      if (i > 0) {
        await new Promise((r) => setTimeout(r, 5000));
      }

      const res = await fetch("/api/dailymotion/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      });

      const data = await res.json();
      lastData = data;

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "status_check_failed");
      }

      if (data.ready) {
        setUploadError(null);
        setUploadSuccess(true);
        toast.success(t("dailymotionReady"));
        router.refresh();
        return;
      }
    }

    const progressValue =
      lastData?.publishingProgress ?? lastData?.encodingProgress;

    setUploadSuccess(false);
    setUploadError(
      progressValue !== null && progressValue !== undefined
        ? t("dailymotionProcessingWithProgress", {
            progress: progressValue,
          })
        : lastData?.statusMessage || t("dailymotionProcessing")
    );

    router.refresh();
  } catch (err) {
    console.error("[LessonMediaManager] refreshDailymotionStatus failed", err);
    setUploadError(t("errorGeneric"));
  }
}

  const busy = isUploading || isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          {t("sectionTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {existingMedia && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={existingMedia.isReady ? "default" : "secondary"}>
              {existingMedia.isReady ? t("statusReady") : t("statusNotReady")}
            </Badge>

            <Badge variant="outline">
              {existingMedia.provider === "cloudinary"
                ? t("providerCloudinary")
                : existingMedia.provider === "dailymotion"
                ? t("providerDailymotion")
                : t("providerExternal")}
            </Badge>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {t("previewButton")}
              </a>
            )}

            <AlertDialogDeleteButton lessonId={lessonId} />
          </div>
        )}

        {!existingMedia && (
          <p className="text-sm text-muted-foreground">
            {t("noMediaDescription")}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">
            {t("sourceTypeLabel")}
          </label>

          <Select
            value={sourceType}
            onValueChange={(v) => setSourceType(v as SourceTypeTab)}
          >
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="cloudinary">
                {t("sourceCloudinary")}
              </SelectItem>
              <SelectItem value="dailymotion_upload">
                {t("sourceDailymotionUpload")}
              </SelectItem>
              <SelectItem value="dailymotion_link">
                {t("sourceDailymotionLink")}
              </SelectItem>
              <SelectItem value="external_link">
                {t("sourceDirectMedia")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sourceType === "cloudinary" && (
          <div className="space-y-3 rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground">{t("uploadHint")}</p>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                setUploadFile(e.target.files?.[0] ?? null);
                setUploadSuccess(false);
                setUploadError(null);
                setUploadProgress({
                  progress: 0,
                  uploadedBytes: 0,
                  totalBytes: 0,
                  speedBps: 0,
                  etaSeconds: null,
                });
              }}
              disabled={busy}
              className="block w-full text-sm text-text-primary file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-white"
            />

            {uploadFile && (
              <div className="rounded-md bg-muted/40 p-3 text-xs text-text-secondary space-y-1">
                <p>{uploadFile.name}</p>
                <p>{formatBytes(uploadFile.size)}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleCloudinaryUploadAndSave}
                disabled={!uploadFile || busy}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("uploading")}
                  </>
                ) : (
                  t("uploadButton")
                )}
              </Button>

              {isUploading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelUpload}
                >
                  {t("cancelButton")}
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={refreshDailymotionStatus}
              disabled={busy}
            >
              {t("checkStatusButton")}
            </Button>

            {isUploading && sourceType === "cloudinary" && (
              <div className="rounded-md border border-border bg-background p-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">
                    {uploadProgress.progress}%
                  </span>
                  <span className="text-text-secondary">
                    {formatBytes(uploadProgress.uploadedBytes)} /{" "}
                    {formatBytes(uploadProgress.totalBytes)}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                  <span>{t("uploadSpeedLabel", { value: speedText })}</span>
                  <span>
                    {t("uploadEtaLabel", {
                      value: formatEta(uploadProgress.etaSeconds, t),
                    })}
                  </span>
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("successSave")}</span>
                </div>

                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-700 underline"
                  >
                    {t("previewButton")}
                  </a>
                )}

                <Link
                  href={`/${locale}/teacher/courses/${courseId}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("doneButton")}
                </Link>
              </div>
            )}
          </div>
        )}

        {sourceType === "dailymotion_upload" && (
          <div className="space-y-3 rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground">
              {t("dailymotionUploadHint")}
            </p>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                setDmUploadFile(e.target.files?.[0] ?? null);
                setUploadSuccess(false);
                setUploadError(null);
                setUploadProgress({
                  progress: 0,
                  uploadedBytes: 0,
                  totalBytes: 0,
                  speedBps: 0,
                  etaSeconds: null,
                });
              }}
              disabled={busy}
              className="block w-full text-sm text-text-primary file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-white"
            />

            {dmUploadFile && (
              <div className="rounded-md bg-muted/40 p-3 text-xs text-text-secondary space-y-1">
                <p>{dmUploadFile.name}</p>
                <p>{formatBytes(dmUploadFile.size)}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleDailymotionUpload}
                disabled={!dmUploadFile || busy}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("uploading")}
                  </>
                ) : (
                  t("uploadButton")
                )}
              </Button>

              {isUploading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelUpload}
                >
                  {t("cancelButton")}
                </Button>
              )}
            </div>

            {isUploading && sourceType === "dailymotion_upload" && (
              <div className="rounded-md border border-border bg-background p-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">
                    {uploadProgress.progress}%
                  </span>
                  <span className="text-text-secondary">
                    {formatBytes(uploadProgress.uploadedBytes)} /{" "}
                    {formatBytes(uploadProgress.totalBytes)}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                  <span>{t("uploadSpeedLabel", { value: speedText })}</span>
                  <span>
                    {t("uploadEtaLabel", {
                      value: formatEta(uploadProgress.etaSeconds, t),
                    })}
                  </span>
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("successSave")}</span>
                </div>

                <Link
                  href={`/${locale}/teacher/courses/${courseId}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("doneButton")}
                </Link>
              </div>
            )}
          </div>
        )}

        {sourceType === "dailymotion_link" && (
          <form onSubmit={handleDailymotionLinkSave} className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {t("dailymotionLinkHint")}
            </p>

            <Input
              type="text"
              placeholder={t("dailymotionLinkPlaceholder")}
              value={dmLinkInput}
              onChange={(e) => setDmLinkInput(e.target.value)}
              dir="ltr"
            />

            <Button type="submit" disabled={busy || !dmLinkInput}>
              {busy ? t("saving") : t("saveButton")}
            </Button>
          </form>
        )}

        {sourceType === "external_link" && (
          <form onSubmit={handleExternalSave} className="space-y-2">
            <p className="text-xs text-amber-600">
              {t("externalDirectOnlyWarning")}
            </p>

            <Input
              type="url"
              placeholder={t("externalUrlPlaceholder")}
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              dir="ltr"
            />

            <Button type="submit" disabled={busy || !externalUrl}>
              {busy ? t("saving") : t("saveButton")}
            </Button>
          </form>
        )}

        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}
      </CardContent>
    </Card>
  );
}
