import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { fetchConfig } from "@/components/withConfigPage";

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

  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json(
      { message: "Missing domain param" },
      { status: 400 },
    );
  }

  revalidateTag("config-" + domain);

  const { updated_at } = await fetchConfig(domain);

  return NextResponse.json({ revalidated: true, updated_at });
}
