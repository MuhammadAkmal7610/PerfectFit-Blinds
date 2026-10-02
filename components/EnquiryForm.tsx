"use client";

import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blindOptions, enquirySchema, serviceOptions, type EnquiryFormInput, type EnquiryFormValues } from "@/lib/enquiry-schema";

export function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormInput, unknown, EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      service_required: "Free home measurement",
      blind_type: "Perfect Fit blinds",
    },
  });
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minAppointmentDate = today.toISOString().slice(0, 10);

  const onSubmit = async (values: EnquiryFormValues) => {
    setSubmitError("");

    let response: Response;
    try {
      response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      setSubmitError("We could not send your request. Please check your connection and try again.");
      return;
    }

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setSubmitError(result.error || "We could not send your request. Please try again.");
      return;
    }

    reset();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-slate-800 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-emerald-700">
          <CheckCircle2 className="h-6 w-6" />
          <h3 className="text-2xl font-semibold">Request received</h3>
        </div>
        <p className="text-base leading-7 text-slate-700">
          Thanks for your enquiry. Our team will review your details and get back to you shortly to
          confirm the next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(23,23,23,0.06)] sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">Tell us about your home</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">Share a few details and our local team will take it from there.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input {...register("name")} autoComplete="name" aria-invalid={Boolean(errors.name)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="John Smith" />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Telephone
          <input {...register("telephone")} type="tel" autoComplete="tel" aria-invalid={Boolean(errors.telephone)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="07700 900123" />
          {errors.telephone && <span className="mt-1 block text-xs text-red-600">{errors.telephone.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email address
          <input {...register("email")} type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="john@example.com" />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Postcode
          <input {...register("postcode")} autoComplete="postal-code" aria-invalid={Boolean(errors.postcode)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="M28 3AA" />
          <span className="mt-1 block text-xs text-slate-500">We cover Manchester and nearby areas, including Bolton, Stockport, Oldham and Wigan.</span>
          {errors.postcode && <span className="mt-1 block text-xs text-red-600">{errors.postcode.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Type of blinds required
          <select {...register("blind_type")} aria-invalid={Boolean(errors.blind_type)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100">
            {blindOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.blind_type && <span className="mt-1 block text-xs text-red-600">{errors.blind_type.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Number of windows
          <input {...register("number_of_windows")} type="number" min={1} max={100} step={1} inputMode="numeric" aria-invalid={Boolean(errors.number_of_windows)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="4" />
          {errors.number_of_windows && <span className="mt-1 block text-xs text-red-600">{errors.number_of_windows.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Preferred appointment date
          <div className="relative mt-2">
            <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input {...register("preferred_date")} type="date" min={minAppointmentDate} aria-invalid={Boolean(errors.preferred_date)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" />
          </div>
          {errors.preferred_date && <span className="mt-1 block text-xs text-red-600">{errors.preferred_date.message}</span>}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Service required
          <select {...register("service_required")} aria-invalid={Boolean(errors.service_required)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100">
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.service_required && <span className="mt-1 block text-xs text-red-600">{errors.service_required.message}</span>}
        </label>
      </div>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" {...register("website")} tabIndex={-1} autoComplete="off" />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Message / additional information
        <textarea {...register("message")} rows={4} maxLength={500} aria-invalid={Boolean(errors.message)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-700 focus:bg-white focus:ring-2 focus:ring-sky-100" placeholder="Tell us about your room, style preferences, or any specific measurements you have in mind." />
        {errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}
      </label>

      {submitError && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

      <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending request...
          </>
        ) : (
          "Request a free quote"
        )}
      </button>
    </form>
  );
}
