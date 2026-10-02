"use client";

export default function ApplicationError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg border border-slate-200 bg-white p-8">
        <p className="text-sm font-semibold text-red-700">Something went wrong</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-slate-900">This page is temporarily unavailable.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Please try again in a moment.</p>
        <button type="button" onClick={() => retry()} className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Try again</button>
      </section>
    </main>
  );
}