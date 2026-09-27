import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "Lead Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard />
      </div>
    </main>
  );
}
