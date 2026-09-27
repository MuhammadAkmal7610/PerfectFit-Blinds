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

function getDatabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured.");
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

export async function updateEnquiryStatus(id: number, status: EnquiryStatus): Promise<EnquiryRecord | undefined> {
  const { data, error } = await getDatabaseClient()
    .from("enquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Unable to update the enquiry in the database.", { cause: error });
  }

  return (data as EnquiryRecord | null) ?? undefined;
}
