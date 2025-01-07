import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseDialog } from "@/components/expenses/ExpenseDialog";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Receipt } from "lucide-react";

const ExpensesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: expenses, refetch } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Receipt className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <ExpensesTable expenses={expenses || []} onExpenseUpdated={refetch} />

      <ExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onExpenseCreated={refetch}
      />
    </div>
  );
};

export default ExpensesPage;