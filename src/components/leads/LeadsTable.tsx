import { useState } from "react";
import { LeadDialog } from "./LeadDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2Icon, Trash2Icon } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
}

interface LeadsTableProps {
  leads: Lead[];
  onLeadUpdated: () => void;
}

export const LeadsTable = ({ leads, onLeadUpdated }: LeadsTableProps) => {
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deletingLeadId) return;

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", deletingLeadId);

    if (error) {
      toast({
        title: "Error deleting lead",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Lead deleted",
        description: "The lead has been successfully deleted.",
      });
      onLeadUpdated();
    }

    setDeletingLeadId(null);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "qualified":
        return "bg-green-500";
      case "proposal":
        return "bg-purple-500";
      case "negotiation":
        return "bg-orange-500";
      case "won":
        return "bg-emerald-500";
      case "lost":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company || "-"}</TableCell>
                <TableCell>{lead.email || "-"}</TableCell>
                <TableCell>{lead.phone || "-"}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status || "new"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingLead(lead)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingLeadId(lead.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDialog
        open={!!editingLead}
        onOpenChange={(open) => !open && setEditingLead(null)}
        lead={editingLead}
        onLeadCreated={onLeadUpdated}
      />

      <AlertDialog open={!!deletingLeadId} onOpenChange={setDeletingLeadId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};