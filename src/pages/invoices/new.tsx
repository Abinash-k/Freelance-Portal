
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigation } from "@/components/Navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

const NewInvoicePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Create New Invoice</h1>
              <p className="text-muted-foreground mt-2">Fill out the form below to generate a new invoice.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <InvoiceForm />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default NewInvoicePage;

