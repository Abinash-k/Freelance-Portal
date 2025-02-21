
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useQuery } from "@tanstack/react-query";
import { getStatusColor } from "./utils";
import { InvoiceActions } from "./InvoiceActions";

export const InvoicesTable = ({ invoices, onInvoiceUpdated }: any) => {
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

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

  const generateInvoicePDF = async (invoice: any) => {
    try {
      if (!businessDetails) {
        toast({
          title: "Business details missing",
          description: "Please add your business details in the settings page first.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: {
          documentType: 'invoice',
          documentData: {
            ...invoice,
            businessDetails,
          },
        },
      });

      if (error) throw error;

      // Create a Blob from the PDF data
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger the download
      const link = document.createElement('a');
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

  const generateInvoiceText = async (invoice: any) => {
    try {
      if (!businessDetails) {
        toast({
          title: "Business details missing",
          description: "Please add your business details in the settings page first.",
          variant: "destructive",
        });
        return;
      }

      const template = `
INVOICE

From:
${businessDetails.business_name}
${businessDetails.address || ""}
${businessDetails.email || ""}
${businessDetails.phone || ""}
${businessDetails.website || ""}

To:
${invoice.client_name}

Invoice Details:
Invoice Number: ${invoice.invoice_number}
Issue Date: ${format(new Date(invoice.issue_date), "PP")}
Due Date: ${format(new Date(invoice.due_date), "PP")}
Status: ${invoice.status}

Amount Due: $${invoice.amount.toFixed(2)}

Thank you for your business!
      `;
      
      const blob = new Blob([template], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating text file:", error);
      toast({
        title: "Error generating text file",
        description: "There was an error generating the text file. Please try again.",
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
                  <InvoiceActions
                    onEdit={() => setEditingInvoice(invoice)}
                    onPrint={() => generateInvoicePDF(invoice)}
                    onDownloadText={() => generateInvoiceText(invoice)}
                    onDelete={() => setDeletingInvoiceId(invoice.id)}
                  />
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
