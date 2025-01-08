import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDialog } from "@/components/invoices/InvoiceDialog";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CircleDollarSign } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const InvoicesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: invoices, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Invoices</h1>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>

            <InvoicesTable invoices={invoices || []} onInvoiceUpdated={refetch} />

            <InvoiceDialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onInvoiceCreated={refetch}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default InvoicesPage;