import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LeadDialog } from "@/components/leads/LeadDialog";

const LeadsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: leads = [], refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching leads",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

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
              <h1 className="text-3xl font-bold">Leads</h1>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
            <LeadsTable leads={leads} onLeadUpdated={refetch} />
            <LeadDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onLeadCreated={refetch}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default LeadsPage;