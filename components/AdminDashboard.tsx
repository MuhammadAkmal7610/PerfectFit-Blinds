"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BadgeCheck, CircleDashed, Gauge, LogOut, Moon, PhoneCall, Search, Sun, TrendingUp } from "lucide-react";
import type { EnquiryRecord, LeadStatusHistoryRecord } from "@/lib/db";
import { blindOptions } from "@/lib/enquiry-schema";

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

function startOfWeek(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

export function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<EnquiryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [blindFilter, setBlindFilter] = useState("All blind types");
  const [postcodeFilter, setPostcodeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [history, setHistory] = useState<LeadStatusHistoryRecord[]>([]);
  const [darkMode, setDarkMode] = useState(false);

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
    const storedTheme = window.localStorage.getItem("perfectfit-admin-dark");
    if (storedTheme === "true") {
      document.documentElement.classList.add("admin-dark-active");
      window.requestAnimationFrame(() => setDarkMode(true));
    }
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

  useEffect(() => {
    if (selectedId === null) {
      return;
    }

    let active = true;
    fetch(`/api/enquiries/${selectedId}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load history.");
        return response.json();
      })
      .then((result) => {
        if (active) setHistory(result.history ?? []);
      })
      .catch(() => {
        if (active) setHistory([]);
      });
    return () => { active = false; };
  }, [selectedId]);

  const summary = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === "New").length,
    measurementBooked: leads.filter((lead) => lead.status === "Measurement Booked").length,
    quoteSent: leads.filter((lead) => lead.status === "Quote Sent").length,
    won: leads.filter((lead) => lead.status === "Won").length,
  }), [leads]);

  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? leads[0];

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const createdDate = lead.created_at.slice(0, 10);
    return (statusFilter === "All statuses" || lead.status === statusFilter)
      && (blindFilter === "All blind types" || lead.blind_type === blindFilter)
      && lead.postcode.toLowerCase().includes(postcodeFilter.trim().toLowerCase())
      && (!dateFrom || createdDate >= dateFrom)
      && (!dateTo || createdDate <= dateTo);
  }), [leads, statusFilter, blindFilter, postcodeFilter, dateFrom, dateTo]);

  const weeklyLeads = useMemo(() => {
    const currentWeek = startOfWeek(new Date());
    return Array.from({ length: 6 }, (_, index) => {
      const weekStart = new Date(currentWeek);
      weekStart.setDate(currentWeek.getDate() - (5 - index) * 7);
      const nextWeek = new Date(weekStart);
      nextWeek.setDate(weekStart.getDate() + 7);
      return {
        label: weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        count: leads.filter((lead) => {
          const created = new Date(lead.created_at);
          return created >= weekStart && created < nextWeek;
        }).length,
      };
    });
  }, [leads]);

  const funnel = [
    { label: "New", count: leads.filter((lead) => lead.status === "New").length },
    { label: "Quote sent", count: leads.filter((lead) => lead.status === "Quote Sent").length },
    { label: "Won", count: summary.won },
  ];
  const maximumWeeklyCount = Math.max(1, ...weeklyLeads.map((week) => week.count));

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    window.localStorage.setItem("perfectfit-admin-dark", String(nextTheme));
    document.documentElement.classList.toggle("admin-dark-active", nextTheme);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Unable to update status.");
      const result = await response.json();
      setHistory(result.history ?? []);
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
    <div className={`admin-theme min-h-screen space-y-6 p-4 sm:p-6 ${darkMode ? "admin-dark" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-sky-800">Lead dashboard</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-900">Enquiry overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300">
            {darkMode ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
          </button>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="weekly-chart-heading">
          <h2 id="weekly-chart-heading" className="font-heading text-lg font-semibold text-slate-900">Leads per week</h2>
          <div className="mt-5 grid h-40 grid-cols-6 items-end gap-3" role="img" aria-label={`Weekly enquiry counts: ${weeklyLeads.map((week) => `${week.label}, ${week.count}`).join("; ")}`}>
            {weeklyLeads.map((week) => (
              <div key={week.label} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium text-slate-600">{week.count}</span>
                <div className="flex h-28 w-full items-end rounded-sm bg-slate-100">
                  <div className="w-full rounded-sm bg-sky-700 transition-[height]" style={{ height: `${Math.max(week.count ? 10 : 0, (week.count / maximumWeeklyCount) * 100)}%` }} />
                </div>
                <span className="text-center text-[11px] text-slate-500">{week.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="funnel-heading">
          <h2 id="funnel-heading" className="font-heading text-lg font-semibold text-slate-900">Conversion funnel</h2>
          <div className="mt-5 space-y-4">
            {funnel.map((stage) => (
              <div key={stage.label}>
                <div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{stage.label}</span><span className="font-semibold text-slate-900">{stage.count}</span></div>
                <div className="h-2 overflow-hidden rounded-sm bg-slate-100"><div className="h-full rounded-sm bg-emerald-700" style={{ width: `${leads.length ? Math.max(stage.count ? 5 : 0, stage.count / leads.length * 100) : 0}%` }} /></div>
              </div>
            ))}
            <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">{summary.won} of {summary.total} total leads won</p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold text-slate-900">Recent enquiries</h2>
            <span className="text-sm text-slate-500">{filteredLeads.length} of {leads.length}</span>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <label className="text-xs font-medium text-slate-600">Search postcode
              <span className="relative mt-1 block"><Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input type="search" value={postcodeFilter} onChange={(event) => setPostcodeFilter(event.target.value)} placeholder="M28 3AA" className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900" /></span>
            </label>
            <label className="text-xs font-medium text-slate-600">Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option>All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select>
            </label>
            <label className="text-xs font-medium text-slate-600">Blind type
              <select value={blindFilter} onChange={(event) => setBlindFilter(event.target.value)} className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option>All blind types</option>{blindOptions.map((blind) => <option key={blind}>{blind}</option>)}</select>
            </label>
            <label className="text-xs font-medium text-slate-600">From date
              <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
            </label>
            <label className="text-xs font-medium text-slate-600">To date
              <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
            </label>
            <button type="button" onClick={() => { setStatusFilter("All statuses"); setBlindFilter("All blind types"); setPostcodeFilter(""); setDateFrom(""); setDateTo(""); }} className="self-end rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">Clear filters</button>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-slate-500">Loading enquiries…</p>
          ) : leads.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No enquiries yet.</p>
          ) : filteredLeads.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No enquiries match these filters.</p>
          ) : (
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <button
                  type="button"
                  key={lead.id}
                  onClick={() => { setHistory([]); setSelectedId(lead.id); }}
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

              <section className="mt-6 border-t border-slate-200 pt-5" aria-labelledby="status-history-heading">
                <h3 id="status-history-heading" className="font-heading text-lg font-semibold text-slate-900">Status history</h3>
                {history.length ? (
                  <ol className="mt-4 space-y-4 border-l border-slate-200 pl-4">
                    {history.map((entry) => (
                      <li key={entry.id} className="relative text-sm before:absolute before:-left-[21px] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-sky-700">
                        <p className="font-medium text-slate-900">{entry.old_status ? `Moved from ${entry.old_status} to ${entry.new_status}` : `Lead created as ${entry.new_status}`}</p>
                        <p className="mt-1 text-xs text-slate-500">{new Date(entry.changed_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} by {entry.changed_by}</p>
                      </li>
                    ))}
                  </ol>
                ) : <p className="mt-3 text-sm text-slate-500">No status history available.</p>}
              </section>
            </>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">Select an enquiry to view details.</div>
          )}
        </section>
      </div>
    </div>
  );
}
