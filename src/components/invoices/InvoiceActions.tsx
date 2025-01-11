import { Button } from "@/components/ui/button";
import { FileText, Printer, Download, Trash } from "lucide-react";

interface InvoiceActionsProps {
  onEdit: () => void;
  onPrint: () => void;
  onDownloadText: () => void;
  onDelete: () => void;
}

export const InvoiceActions = ({ onEdit, onPrint, onDownloadText, onDelete }: InvoiceActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={onEdit}>
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onPrint}>
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDownloadText}>
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};