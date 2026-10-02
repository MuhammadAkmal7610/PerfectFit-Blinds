import { NextResponse } from "next/server";
import { consumeEnquiryRateLimit, createEnquiry } from "@/lib/db";
import { sendEnquiryNotifications } from "@/lib/email";
import { isAdminAuthenticated } from "@/lib/admin";
import { enquirySchema } from "@/lib/enquiry-schema";
import { getEnquiryFingerprint } from "@/lib/rate-limit";

function getDatabaseErrorCode(error: unknown) {
  if (!(error instanceof Error) || !error.cause || typeof error.cause !== "object") {
    return undefined;
  }

  const cause = error.cause as { code?: unknown };
  return typeof cause.code === "string" ? cause.code : undefined;
}

function getDatabaseErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.startsWith("Missing required server environment variables:")) {
    return NextResponse.json(
      { error: "Database configuration is incomplete. Set the required server variables in Vercel and redeploy." },
      { status: 503 },
    );
  }

  const code = getDatabaseErrorCode(error);

  if (code === "PGRST205" || code === "PGRST202") {
    return NextResponse.json(
      { error: "Database setup is incomplete. Run supabase/schema.sql in the Supabase SQL Editor." },
      { status: 503 },
    );
  }

  if (code === "PGRST301" || code === "401") {
    return NextResponse.json(
      { error: "Database authentication is not configured correctly." },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { getAllEnquiries } = await import("@/lib/db");
    return NextResponse.json({ leads: await getAllEnquiries() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to fetch enquiries", error);
    return getDatabaseErrorResponse(error, "Unable to fetch enquiries right now.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body?.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const allowed = await consumeEnquiryRateLimit(getEnquiryFingerprint(request));
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }

    const parsed = enquirySchema.omit({ website: true }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please check your details and try again." },
        { status: 400 },
      );
    }

    const enquiry = await createEnquiry({
      ...parsed.data,
      message: parsed.data.message || null,
    });
    const notificationsSent = await sendEnquiryNotifications(enquiry);

    return NextResponse.json({ success: true, notificationsSent }, { status: 201 });
  } catch (error) {
    console.error("Failed to create enquiry", error);
    return getDatabaseErrorResponse(error, "Unable to submit your request right now.");
  }
}
