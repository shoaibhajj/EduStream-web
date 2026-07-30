import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function generateSignedUploadParams(folder: string): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  type: string;
} {
  const timestamp = Math.round(Date.now() / 1000);
  const type = "authenticated";
  const paramsToSign = { folder, timestamp, type };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    type,
  };
}
