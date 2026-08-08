const DM_PARTNER_API_BASE = "https://partner.api.dailymotion.com";

export type DailymotionUploadResult = {
  videoId: string;
  privateId?: string;
  durationSeconds?: number;
};

function requireDmEnv() {
  const apiKey = process.env.DAILYMOTION_API_KEY;
  const apiSecret = process.env.DAILYMOTION_API_SECRET;
  const profileId = process.env.DAILYMOTION_PROFILE_ID;

  if (!apiKey || !apiSecret || !profileId) {
    throw new Error("dm_env_missing");
  }

  return { apiKey, apiSecret, profileId };
}

export async function getDailymotionAccessToken(): Promise<string> {
  const { apiKey, apiSecret } = requireDmEnv();

  const res = await fetch(`${DM_PARTNER_API_BASE}/oauth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: apiKey,
      client_secret: apiSecret,
      scope: "manage_videos",
    }),
    cache: "no-store",
  });

  const text = await res.text();
  let data: {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`dm_token_invalid_json:${text}`);
  }

  if (!res.ok || !data.access_token) {
    throw new Error(
      `dm_token_failed:${res.status}:${data.error ?? "unknown"}:${
        data.error_description ?? text
      }`
    );
  }

  return data.access_token;
}

async function createUploadSession(accessToken: string): Promise<{
  upload_url: string;
  progress_url?: string;
}> {
  const res = await fetch(`${DM_PARTNER_API_BASE}/rest/file/upload`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await res.text();
  let data: { upload_url?: string; progress_url?: string; error?: string };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`dm_upload_url_invalid_json:${text}`);
  }

  if (!res.ok || !data.upload_url) {
    throw new Error(`dm_upload_url_failed:${res.status}:${data.error ?? text}`);
  }

  return {
    upload_url: data.upload_url,
    progress_url: data.progress_url,
  };
}

export async function uploadFileToDailymotion(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  accessToken: string
): Promise<DailymotionUploadResult> {
  const { profileId } = requireDmEnv();
  const session = await createUploadSession(accessToken);

  const form = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)], {
    type: mimeType || "video/mp4",
  });
  form.append("file", blob, fileName);

  const uploadRes = await fetch(session.upload_url, {
    method: "POST",
    body: form,
    cache: "no-store",
  });

  const uploadText = await uploadRes.text();
  let uploadData: {
    url?: string;
    duration?: string;
    error?: string;
  };

  try {
    uploadData = JSON.parse(uploadText);
  } catch {
    throw new Error(`dm_file_upload_invalid_json:${uploadText}`);
  }

  if (!uploadRes.ok || !uploadData.url) {
    throw new Error(
      `dm_file_upload_failed:${uploadRes.status}:${
        uploadData.error ?? uploadText
      }`
    );
  }

  const createRes = await fetch(
    `${DM_PARTNER_API_BASE}/rest/user/${profileId}/videos`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        url: uploadData.url,
        title: fileName,
        published: "false",
        private: "true",
        is_created_for_kids: "false",
        channel: "school",
      }),
      cache: "no-store",
    }
  );

  const createText = await createRes.text();
  let createData: {
    id?: string;
    private_id?: string;
    error?: string;
  };

  try {
    createData = JSON.parse(createText);
  } catch {
    throw new Error(`dm_create_video_invalid_json:${createText}`);
  }

  if (!createRes.ok || !createData.id) {
    throw new Error(
      `dm_create_video_failed:${createRes.status}:${
        createData.error ?? createText
      }`
    );
  }

  let privateId = createData.private_id;

  if (!privateId && createData.id) {
    privateId = await getDailymotionPrivateId(accessToken, createData.id);
  }

  return {
    videoId: createData.id,
    privateId,
    durationSeconds: uploadData.duration
      ? Math.round(Number(uploadData.duration) / 1000)
      : undefined,
  };
}

export async function getDailymotionPrivateId(
  accessToken: string,
  videoId: string
): Promise<string | undefined> {
  const res = await fetch(
    `${DM_PARTNER_API_BASE}/rest/video/${videoId}?fields=id,private_id,private`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const text = await res.text();
  let data: { private_id?: string };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`dm_private_id_invalid_json:${text}`);
  }

  if (!res.ok) {
    throw new Error(`dm_private_id_failed:${res.status}:${text}`);
  }

  return data.private_id;
}


export async function getDailymotionVideoStatus(
  accessToken: string,
  videoId: string
): Promise<{
  id: string;
  private?: boolean;
  private_id?: string;
  published?: boolean;
  status?: string | null;
  encoding_progress?: number | null;
  publishing_progress?: number | null;
  error_code?: string | null;
  error_title?: string | null;
  error_message?: string | null;
  ready: boolean;
}> {
  const res = await fetch(
    `${DM_PARTNER_API_BASE}/rest/video/${videoId}?fields=id,private,private_id,published,status,encoding_progress,publishing_progress`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const text = await res.text();
  let data: {
    id?: string;
    private?: boolean;
    private_id?: string;
    published?: boolean;
    status?: string;
    encoding_progress?: number;
    publishing_progress?: number;
    error?: {
      code?: string;
      title?: string;
      message?: string;
    };
  };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`dm_video_status_invalid_json:${text}`);
  }

  if (!res.ok || !data.id) {
    throw new Error(`dm_video_status_failed:${res.status}:${text}`);
  }

  const status = data.status ?? null;
  const errorCode = data.error?.code ?? null;

  const ready =
    status === "ready" ||
    status === "published" ||
    (errorCode !== "DM006" && status !== "waiting" && status !== "processing");

  return {
    id: data.id,
    private: data.private,
    private_id: data.private_id,
    published: data.published,
    status,
    encoding_progress: data.encoding_progress ?? null,
    publishing_progress: data.publishing_progress ?? null,
    error_code: errorCode,
    error_title: data.error?.title ?? null,
    error_message: data.error?.message ?? null,
    ready,
  };
}