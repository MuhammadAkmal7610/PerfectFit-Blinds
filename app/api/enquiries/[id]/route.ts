import { NextResponse } from "next/server";
import { z } from "zod";
import { getConfiguredAdminUsername, isAdminAuthenticated } from "@/lib/admin";
import { getEnquiryById, getLeadStatusHistory, updateEnquiryStatus } from "@/lib/db";

const statusSchema = z.enum(["New", "Contacted", "Measurement Booked", "Quote Sent", "Won", "Lost"]);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const enquiryId = Number(id);
    if (!Number.isSafeInteger(enquiryId) || enquiryId < 1) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const lead = await getEnquiryById(enquiryId);
    if (!lead) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    return NextResponse.json({ lead, history: await getLeadStatusHistory(enquiryId) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to fetch enquiry history", error);
    return NextResponse.json({ error: "Unable to fetch enquiry history" }, { status: 500 });
  }
}

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

    const updated = await updateEnquiryStatus(enquiryId, parsed.data, getConfiguredAdminUsername());
    if (!updated) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    return NextResponse.json({ lead: updated, history: await getLeadStatusHistory(enquiryId) });
  } catch (error) {
    console.error("Failed to update enquiry status", error);
    return NextResponse.json({ error: "Unable to update status" }, { status: 500 });
  }
}
