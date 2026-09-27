import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";
import { enquirySchema } from "@/lib/enquiry-schema";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { getAllEnquiries } = await import("@/lib/db");
    return NextResponse.json({ leads: await getAllEnquiries() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to fetch enquiries", error);
    return NextResponse.json({ error: "Unable to fetch enquiries" }, { status: 500 });
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
    return NextResponse.json({ error: "Unable to submit your request right now." }, { status: 500 });
  }
}
