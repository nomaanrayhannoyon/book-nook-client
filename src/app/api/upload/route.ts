import { NextResponse, type NextRequest } from "next/server";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB (ImgBB allows up to 32 MB)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
];

interface ImgBbResponse {
  success?: boolean;
  data?: { url?: string; display_url?: string };
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Uploads a cover image to ImgBB and returns a public URL.
 * The API key is read only from this server-side route — it is never sent to
 * the browser, logged, or included in an error message.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return errorResponse("Image upload is temporarily unavailable.", 503);
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return errorResponse("Invalid upload request.", 400);
  }

  const image = incoming.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return errorResponse("Please choose an image file.", 400);
  }
  if (image.size > MAX_FILE_BYTES) {
    return errorResponse("Image must be 10 MB or smaller.", 400);
  }
  if (image.type && !ALLOWED_TYPES.includes(image.type)) {
    return errorResponse(
      "Unsupported image format. Use JPG, PNG, WEBP, GIF or BMP.",
      400,
    );
  }

  const upload = new FormData();
  upload.append("image", image, image.name || "cover.png");

  let payload: ImgBbResponse | null = null;

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: upload, cache: "no-store" },
    );
    payload = (await response.json().catch(() => null)) as ImgBbResponse | null;
    if (!response.ok || !payload?.success) {
      // Do not forward provider error bodies: they may echo request details.
      return errorResponse("Image upload failed. Please try another image.", 502);
    }
  } catch {
    return errorResponse("Image upload failed. Please try again.", 502);
  }

  const url = payload?.data?.display_url ?? payload?.data?.url;
  if (typeof url !== "string" || !url) {
    return errorResponse("Image upload failed. Please try again.", 502);
  }

  return NextResponse.json({ url });
}
