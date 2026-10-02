import "server-only";
import { createClient } from "@supabase/supabase-js";

export type EnquiryStatus =
  | "New"
  | "Contacted"
  | "Measurement Booked"
  | "Quote Sent"
  | "Won"
  | "Lost";

export interface EnquiryRecord {
  id: number;
  name: string;
  telephone: string;
  email: string;
  postcode: string;
  blind_type: string;
  number_of_windows: number;
  preferred_date: string;
  service_required: string;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadStatusHistoryRecord {
  id: number;
  lead_id: number;
  old_status: EnquiryStatus | null;
  new_status: EnquiryStatus;
  changed_at: string;
  changed_by: string;
}

function getDatabaseClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    const missing = [
      !url && "SUPABASE_URL",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    throw new Error(`Missing required server environment variables: ${missing.join(", ")}.`);
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getAllEnquiries(): Promise<EnquiryRecord[]> {
  const { data, error } = await getDatabaseClient()
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to read enquiries from the database.", { cause: error });
  }

  return (data ?? []) as EnquiryRecord[];
}

export async function getEnquiryById(id: number): Promise<EnquiryRecord | undefined> {
  const { data, error } = await getDatabaseClient()
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to read the enquiry from the database.", { cause: error });
  }

  return (data as EnquiryRecord | null) ?? undefined;
}

export async function getLeadStatusHistory(id: number): Promise<LeadStatusHistoryRecord[]> {
  const { data, error } = await getDatabaseClient()
    .from("lead_status_history")
    .select("*")
    .eq("lead_id", id)
    .order("changed_at", { ascending: false });

  if (error) {
    throw new Error("Unable to read enquiry status history.", { cause: error });
  }

  return (data ?? []) as LeadStatusHistoryRecord[];
}

export async function createEnquiry(input: {
  name: string;
  telephone: string;
  email: string;
  postcode: string;
  blind_type: string;
  number_of_windows: number;
  preferred_date: string;
  service_required: string;
  message?: string | null;
}): Promise<EnquiryRecord> {
  const { data, error } = await getDatabaseClient()
    .from("enquiries")
    .insert({ ...input, message: input.message ?? null, status: "New" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Unable to save the enquiry to the database.", { cause: error });
  }

  return data as EnquiryRecord;
}

export async function consumeEnquiryRateLimit(fingerprint: string): Promise<boolean> {
  const { data, error } = await getDatabaseClient().rpc("consume_enquiry_rate_limit", {
    p_fingerprint: fingerprint,
    p_limit: 5,
  });

  if (error) {
    throw new Error("Unable to check enquiry rate limit.", { cause: error });
  }

  return data === true;
}

export async function updateEnquiryStatus(id: number, status: EnquiryStatus, changedBy: string): Promise<EnquiryRecord | undefined> {
  const { data, error } = await getDatabaseClient().rpc("update_enquiry_status", {
    p_lead_id: id,
    p_new_status: status,
    p_changed_by: changedBy,
  });

  if (error) {
    throw new Error("Unable to update the enquiry in the database.", { cause: error });
  }

  return ((data as EnquiryRecord[] | null)?.[0]) ?? undefined;
}
