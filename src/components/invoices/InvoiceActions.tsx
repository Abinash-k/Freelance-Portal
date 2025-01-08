import { Button } from "@/components/ui/button";
import { FileText, Printer, Trash } from "lucide-react";

interface InvoiceActionsProps {
  onEdit: () => void;
  onPrint: () => void;
  onDelete: () => void;
}

export const InvoiceActions = ({ onEdit, onPrint, onDelete }: InvoiceActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={onEdit}>
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onPrint}>
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};