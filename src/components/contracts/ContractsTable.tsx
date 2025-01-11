import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractDialog } from "./ContractDialog";
import { format } from "date-fns";
import { FileText, Download, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const ContractsTable = ({ contracts, onContractUpdated }: any) => {
  const [editingContract, setEditingContract] = useState<any>(null);
  const [deletingContract, setDeletingContract] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: businessDetails } = useQuery({
    queryKey: ["businessDetails"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("business_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!deletingContract) return;

    try {
      const { error } = await supabase
        .from("contracts")
        .delete()
        .eq("id", deletingContract);

      if (error) throw error;

      toast({
        title: "Contract deleted",
        description: "The contract has been successfully deleted.",
      });

      onContractUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingContract(null);
    }
  };

  const generateContractTemplate = async (contract: any) => {
    const template = `
CONTRACT AGREEMENT

Between:
${contract.client_name} ("Client")
and
${businessDetails?.business_name || "[Your Company Name]"} ("Service Provider")

Service Provider Details:
Company: ${businessDetails?.business_name || "[Company Name]"}
Email: ${businessDetails?.email || "[Email]"}
Phone: ${businessDetails?.phone || "[Phone]"}
Address: ${businessDetails?.address || "[Address]"}
Website: ${businessDetails?.website || "[Website]"}

Project: ${contract.project_name}

1. SCOPE OF WORK
[Detailed description of the project and deliverables]

2. TIMELINE
Start Date: ${format(new Date(contract.start_date), 'MMMM dd, yyyy')}
End Date: ${format(new Date(contract.end_date), 'MMMM dd, yyyy')}

3. PAYMENT TERMS
Total Contract Value: $${contract.value}
[Payment schedule and terms]

4. TERMS AND CONDITIONS
[Standard terms and conditions]

5. SIGNATURES

_______________________
Client Name: ${contract.client_name}
Date:

_______________________
Service Provider: ${businessDetails?.business_name || "[Your Company Name]"}
Date:
    `;

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract_${contract.client_name}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "sent":
        return "secondary";
      case "signed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract: any) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.client_name}</TableCell>
              <TableCell>{contract.project_name}</TableCell>
              <TableCell>
                {contract.start_date
                  ? format(new Date(contract.start_date), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                {contract.end_date
                  ? format(new Date(contract.end_date), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>${contract.value}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContract(contract)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateContractTemplate(contract)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingContract(contract.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingContract && (
        <ContractDialog
          open={!!editingContract}
          onOpenChange={() => setEditingContract(null)}
          contract={editingContract}
          onContractCreated={onContractUpdated}
        />
      )}

      <AlertDialog 
        open={!!deletingContract} 
        onOpenChange={(open) => setDeletingContract(open ? deletingContract : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contract.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
