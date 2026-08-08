/**
 * Video source classification and normalization.
 * This is the single source of truth for what we support and how we detect it.
 * NEVER duplicate this logic in components or route handlers.
 */

export type VideoSourceType =
  | "cloudinary_upload"
  | "cloudinary_link"
  | "dailymotion_upload"
  | "dailymotion_link"
  | "direct_media"
  | "unsupported";

export type VideoPlaybackStrategy =
  | { strategy: "cloudinary"; signedUrl: string }
  | { strategy: "dailymotion_embed"; videoId: string }
  | { strategy: "native_video"; url: string }
  | { strategy: "unsupported"; reason: string };

const DIRECT_MEDIA_EXTENSIONS = /\.(mp4|webm|m3u8|ogv)(\?.*)?$/i;

const DAILYMOTION_PATTERNS = [
  /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
  /dai\.ly\/([a-zA-Z0-9]+)/,
  /dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/,
];

const UNSUPPORTED_PATTERNS = [
  /drive\.google\.com/,
  /mega\.nz/,
  /mega\.co\.nz/,
  /terabox\.com/,
  /1drv\.ms/,
  /dropbox\.com/,
];

/**
 * Given a raw URL string pasted by a teacher, classify what it is.
 * Returns null if it cannot be classified as anything useful.
 */
export function classifyExternalUrl(url: string): {
  type: VideoSourceType;
  dailymotionVideoId?: string;
} {
  try {
    new URL(url); // Must be a valid URL
  } catch {
    return { type: "unsupported" };
  }

  // Reject known unsupported providers immediately
  if (UNSUPPORTED_PATTERNS.some((p) => p.test(url))) {
    return { type: "unsupported" };
  }

  // Dailymotion detection
  for (const pattern of DAILYMOTION_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return { type: "dailymotion_link", dailymotionVideoId: match[1] };
    }
  }

  // Direct playable media URLs
  if (DIRECT_MEDIA_EXTENSIONS.test(url)) {
    return { type: "direct_media" };
  }

  // Anything else is unsupported — we do not pretend arbitrary URLs can play
  return { type: "unsupported" };
}

/**
 * Extract a Dailymotion video ID from an embed iframe snippet.
 * Returns null if not parseable.
 */
export function extractDailymotionIdFromEmbed(snippet: string): string | null {
  const srcMatch = snippet.match(
    /src=["']https?:\/\/(?:www\.)?dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/
  );
  return srcMatch?.[1] ?? null;
}

/**
 * Normalize a Cloudinary player URL to a public_id if possible.
 * Handles formats like:
 *   https://res.cloudinary.com/<cloud>/video/upload/v.../folder/id.mp4
 *   https://player.cloudinary.com/embed/?public_id=folder/id
 */
export function extractCloudinaryPublicId(
  input: string,
  cloudName: string
): string | null {
  try {
    const url = new URL(input);

    // Player embed URL: ?public_id=xxx
    if (url.hostname === "player.cloudinary.com") {
      const pid = url.searchParams.get("public_id");
      return pid ?? null;
    }

    // Delivery URL: res.cloudinary.com/<cloud>/<resource_type>/upload/<version>/<public_id>.<ext>
    if (
      url.hostname === "res.cloudinary.com" &&
      url.pathname.includes(`/${cloudName}/`)
    ) {
      // Strip leading slash, cloud name, resource_type, upload, optional version
      const parts = url.pathname.replace(/^\//, "").split("/").filter(Boolean);
      // parts: [cloudName, resource_type, "upload", optional "v123456", ...public_id_parts]
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex === -1) return null;
      let rest = parts.slice(uploadIndex + 1);
      // Remove version segment like v1234567890
      if (rest[0]?.match(/^v\d+$/)) rest = rest.slice(1);
      // Remove file extension from last segment
      const lastIdx = rest.length - 1;
      rest[lastIdx] = rest[lastIdx].replace(/\.[a-z0-9]+$/i, "");
      return rest.join("/") || null;
    }
  } catch {
    // not a valid URL, return null
  }
  return null;
}
