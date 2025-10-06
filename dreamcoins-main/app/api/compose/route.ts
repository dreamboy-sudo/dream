import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  return NextResponse.json({ 
    type: 'form',
    title: 'Dreamboy Terminal',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/terminal`, // make sure this is your public URL e.g. http://localhost:3000 for local testing
  });
}

export async function GET() {
  return NextResponse.json({
    "type": "composer", 
    "name": "Dreamboy Terminal",
    "icon": "check", // supported list: https://docs.farcaster.xyz/reference/actions/spec#valid-icons
    "description": "Launch Dreamboy Terminal",
    "aboutUrl": `${process.env.NEXT_PUBLIC_APP_URL}/faq`,
    "imageUrl": `${process.env.NEXT_PUBLIC_APP_URL}/images/sky-foundation.png`,
    "action": {
      "type": "post",
    }
  });
}