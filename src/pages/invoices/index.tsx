import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDialog } from "@/components/invoices/InvoiceDialog";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileDollarSign } from "lucide-react";

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <FileDollarSign className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <InvoicesTable invoices={invoices || []} onInvoiceUpdated={refetch} />

      <InvoiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onInvoiceCreated={refetch}
      />
    </div>
  );
};

export default InvoicesPage;