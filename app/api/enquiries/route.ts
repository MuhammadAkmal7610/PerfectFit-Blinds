import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";
import { enquirySchema } from "@/lib/enquiry-schema";

function getDatabaseErrorCode(error: unknown) {
  if (!(error instanceof Error) || !error.cause || typeof error.cause !== "object") {
    return undefined;
  }

  const cause = error.cause as { code?: unknown };
  return typeof cause.code === "string" ? cause.code : undefined;
}

function getDatabaseErrorResponse(error: unknown, fallbackMessage: string) {
  const code = getDatabaseErrorCode(error);

  if (code === "PGRST205") {
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
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please check your details and try again." },
        { status: 400 },
      );
    }

    await createEnquiry({
      ...parsed.data,
      message: parsed.data.message || null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create enquiry", error);
    return getDatabaseErrorResponse(error, "Unable to submit your request right now.");
  }
}
