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
import { InvoiceDialog } from "./InvoiceDialog";
import { format } from "date-fns";
import { CircleDollarSign, FileText, Printer, Trash } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDFTemplate } from "./InvoicePDFTemplate";

export const InvoicesTable = ({ invoices, onInvoiceUpdated }: any) => {
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deletingInvoiceId) return;

    try {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", deletingInvoiceId);

      if (error) throw error;

      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });

      onInvoiceUpdated();
    } catch (error: any) {
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingInvoiceId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "sent":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const generateInvoicePDF = async (invoice: any) => {
    try {
      // In a real app, these would come from user settings/profile
      const businessDetails = {
        name: "Your Business Name",
        email: "business@example.com",
        phone: "+1 (555) 123-4567",
        website: "www.yourbusiness.com",
        address: "123 Business Street, City, Country",
      };

      const blob = await pdf(
        <InvoicePDFTemplate
          invoice={invoice}
          businessDetails={businessDetails}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice: any) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.client_name}</TableCell>
                <TableCell>
                  {format(new Date(invoice.issue_date), "PP")}
                </TableCell>
                <TableCell>{format(new Date(invoice.due_date), "PP")}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(invoice.status)} text-white`}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingInvoice(invoice)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => generateInvoicePDF(invoice)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingInvoiceId(invoice.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InvoiceDialog
        open={!!editingInvoice}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
        invoice={editingInvoice}
        onInvoiceCreated={onInvoiceUpdated}
      />

      <AlertDialog
        open={!!deletingInvoiceId}
        onOpenChange={(open: boolean) => !open && setDeletingInvoiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice.
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
