import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const withAuthorization = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const apiKey = authHeader.split(" ")[1];
  if (apiKey !== process.env.API_KEY) {
    return false;
  }

  return true;
};

export async function POST(request: NextRequest) {
  if (!withAuthorization(request))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
