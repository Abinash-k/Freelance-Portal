import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContractsTable } from "@/components/contracts/ContractsTable";
import { ContractDialog } from "@/components/contracts/ContractDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const ContractsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: contracts, refetch } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
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
              <h1 className="text-2xl font-bold">Contracts</h1>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Create Contract
              </Button>
            </div>

            <ContractsTable
              contracts={contracts || []}
              onContractUpdated={refetch}
            />

            <ContractDialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onContractCreated={refetch}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ContractsPage;