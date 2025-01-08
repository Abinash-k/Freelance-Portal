import { Navigation } from "@/components/Navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BusinessDetailsForm } from "@/components/settings/BusinessDetailsForm";
import { SidebarProvider } from "@/components/ui/sidebar";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Business Details</h1>
              <p className="text-muted-foreground">
                These details will be used on your invoices
              </p>
            </div>
            <div className="max-w-2xl">
              <BusinessDetailsForm />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SettingsPage;