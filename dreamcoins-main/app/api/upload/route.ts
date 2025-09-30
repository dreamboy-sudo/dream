import { NextResponse } from "next/server";

const UPLOAD_URL = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/upload` : "http://localhost:3001/upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    return NextResponse.json({ error: "Unauthorized - no api token passed" }, { status: 401 });
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
         "Authorization": `Bearer ${apiToken}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      return NextResponse.json(
        { error: 'Upload failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
