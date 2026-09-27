"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BadgeCheck, CircleDashed, Gauge, LogOut, PhoneCall, Search, TrendingUp } from "lucide-react";
import type { EnquiryRecord } from "@/lib/db";

const statusOptions = [
  "New",
  "Contacted",
  "Measurement Booked",
  "Quote Sent",
  "Won",
  "Lost",
] as const;

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString("en-GB", options);
}

export function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<EnquiryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/enquiries", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load enquiries.");
      const result = await response.json();
      const nextLeads: EnquiryRecord[] = result.leads ?? [];
      setLeads(nextLeads);
      setSelectedId((current) => current ?? nextLeads[0]?.id ?? null);
    } catch {
      setLoadError("Enquiries could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialLeads = async () => {
      try {
        const response = await fetch("/api/enquiries", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load enquiries.");
        const result = await response.json();
        const nextLeads: EnquiryRecord[] = result.leads ?? [];
        setLeads(nextLeads);
        setSelectedId((current) => current ?? nextLeads[0]?.id ?? null);
      } catch {
        if (!controller.signal.aborted) setLoadError("Enquiries could not be loaded. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadInitialLeads();
    return () => controller.abort();
  }, []);

  const summary = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === "New").length,
    measurementBooked: leads.filter((lead) => lead.status === "Measurement Booked").length,
    quoteSent: leads.filter((lead) => lead.status === "Quote Sent").length,
    won: leads.filter((lead) => lead.status === "Won").length,
  }), [leads]);

  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? leads[0];

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Unable to update status.");
      await fetchLeads();
    } catch {
      setLoadError("The lead status could not be updated. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out.");
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLoadError("Sign out failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-800">Lead dashboard</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-900">Enquiry overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={fetchLeads} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300">
            <Search aria-hidden="true" className="h-4 w-4" /> Refresh
          </button>
          <button type="button" onClick={logout} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300">
            <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {loadError && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total leads", value: summary.total, icon: TrendingUp },
          { label: "New enquiries", value: summary.new, icon: CircleDashed },
          { label: "Measurements booked", value: summary.measurementBooked, icon: Gauge },
          { label: "Quotes sent", value: summary.quoteSent, icon: ArrowUpRight },
          { label: "Won customers", value: summary.won, icon: BadgeCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-600">{label}</p>
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-sky-700" />
            </div>
            <p className="mt-3 font-heading text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold text-slate-900">Recent enquiries</h2>
            <span className="text-sm text-slate-500">{leads.length} total</span>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-slate-500">Loading enquiries…</p>
          ) : leads.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No enquiries yet.</p>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <button
                  type="button"
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  aria-pressed={selectedLead?.id === lead.id}
                  className={`flex w-full items-center justify-between gap-4 rounded-md border p-4 text-left transition-colors ${selectedLead?.id === lead.id ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-slate-900">{lead.name}</span>
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span>{lead.postcode}</span>
                      <span>{lead.blind_type}</span>
                      <span>{formatDate(lead.preferred_date, { day: "2-digit", month: "short" })}</span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-sm bg-slate-900 px-2 py-1 text-xs font-medium text-white">{lead.status}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="customer-details-heading">
          {selectedLead ? (
            <>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-600">Customer details</p>
                  <h2 id="customer-details-heading" className="mt-1 break-words font-heading text-2xl font-semibold text-slate-900">{selectedLead.name}</h2>
                </div>
                <PhoneCall aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Postcode</dt><dd className="text-right font-medium text-slate-900">{selectedLead.postcode}</dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Service</dt><dd className="text-right font-medium text-slate-900">{selectedLead.service_required}</dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Blinds</dt><dd className="text-right font-medium text-slate-900">{selectedLead.blind_type}</dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Appointment</dt><dd className="text-right font-medium text-slate-900">{formatDate(selectedLead.preferred_date, { day: "2-digit", month: "short", year: "numeric" })}</dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Telephone</dt><dd className="text-right font-medium text-slate-900"><a href={`tel:${selectedLead.telephone}`} className="hover:underline">{selectedLead.telephone}</a></dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Email</dt><dd className="max-w-[65%] break-all text-right font-medium text-slate-900"><a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a></dd></div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-600">Windows</dt><dd className="text-right font-medium text-slate-900">{selectedLead.number_of_windows}</dd></div>
              </dl>

              <div className="mt-5 rounded-md bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold text-slate-600">Customer notes</p>
                <p className="text-sm leading-6 text-slate-700">{selectedLead.message || "No additional message provided."}</p>
              </div>

              <label className="mt-5 block text-sm font-medium text-slate-700">
                Lead status
                <select value={selectedLead.status} onChange={(event) => updateStatus(selectedLead.id, event.target.value)} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100">
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
            </>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">Select an enquiry to view details.</div>
          )}
        </section>
      </div>
    </div>
  );
}
