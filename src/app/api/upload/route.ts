import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {

    return NextResponse.json(
      {
        error:
          "Image upload is not configured. Add IMGBB_API_KEY to .env.local.",
      },
      { status: 503 },

    );
  }

  try {
    const form = await request.formData();

    const image = form.get("image");
    if (!(image instanceof File)) {

      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const uploadForm = new FormData();

    uploadForm.append("image", image);

    const response = await fetch(

      `https://api.imgbb.com/1/upload?key=${apiKey}`,

      { method: "POST", body: uploadForm },
    );
    const data = (await response.json().catch(() => null)) as {
      success?: boolean;

      data?: { url?: string; display_url?: string };

      error?: { message?: string };
    } | null;

    if (!response.ok || !data?.success) {

      return NextResponse.json(

        { error: data?.error?.message ?? "Image upload failed" },

        { status: 502 },
      );
    }

    return NextResponse.json({

      url: data.data?.display_url ?? data.data?.url,
    });
  } catch (err) {

    console.error("Image upload failed:", err);
    return NextResponse.json(

      { error: "Image upload failed. Please try again." },
      
      { status: 500 },
    );

  }
}
