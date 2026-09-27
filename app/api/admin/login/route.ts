import { NextResponse } from "next/server";
import { z } from "zod";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Both fields are required." }, { status: 400 });
    }

    const verification = verifyAdminCredentials(parsed.data.username, parsed.data.password);

    if (verification === "unconfigured") {
      return NextResponse.json({ error: "Admin sign-in is not configured." }, { status: 503 });
    }

    if (verification !== "valid") {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
