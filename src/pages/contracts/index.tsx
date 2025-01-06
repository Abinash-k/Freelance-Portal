import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContractsTable } from "@/components/contracts/ContractsTable";
import { ContractDialog } from "@/components/contracts/ContractDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

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
    <div className="container mx-auto py-10">
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

      {isCreateDialogOpen && (
        <ContractDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onContractCreated={refetch}
        />
      )}
    </div>
  );
};

export default ContractsPage;