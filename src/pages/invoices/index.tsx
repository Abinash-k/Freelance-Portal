
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigation } from "@/components/Navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";

const InvoicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Invoices</h1>
            <InvoicesTable />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default InvoicesPage;
