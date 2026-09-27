import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin";
import { getEnquiryById, updateEnquiryStatus } from "@/lib/db";

const statusSchema = z.enum(["New", "Contacted", "Measurement Booked", "Quote Sent", "Won", "Lost"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = statusSchema.safeParse(body.status);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid lead status" }, { status: 400 });
    }

    const enquiryId = Number(id);
    if (!Number.isSafeInteger(enquiryId) || enquiryId < 1) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const existing = await getEnquiryById(enquiryId);

    if (!existing) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const updated = await updateEnquiryStatus(enquiryId, parsed.data);
    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error("Failed to update enquiry status", error);
    return NextResponse.json({ error: "Unable to update status" }, { status: 500 });
  }
}
