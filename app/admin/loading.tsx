export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading lead dashboard">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-12 w-64 rounded-md bg-slate-200" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 rounded-lg bg-white" />)}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <div className="h-[520px] rounded-lg bg-white" />
          <div className="h-[520px] rounded-lg bg-white" />
        </div>
      </div>
    </main>
  );
}