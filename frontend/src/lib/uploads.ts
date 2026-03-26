import { apiRequest } from "./api";

type PresignedUploadResponse = {
  key: string;
  publicUrl: string;
};

export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const IMAGE_UPLOAD_ACCEPT = SUPPORTED_IMAGE_MIME_TYPES.join(",");

export function isSupportedImageFile(file: File) {
  return SUPPORTED_IMAGE_MIME_TYPES.includes(
    file.type as (typeof SUPPORTED_IMAGE_MIME_TYPES)[number],
  );
}

export async function uploadListingImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { publicUrl } = await apiRequest<PresignedUploadResponse>(
    "/uploads/image",
    {
      method: "POST",
      body: formData,
    },
  );

  return publicUrl;
}

export async function uploadListingImages(files: File[]) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    uploadedUrls.push(await uploadListingImage(file));
  }

  return uploadedUrls;
}
