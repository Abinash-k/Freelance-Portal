import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MeetingsTable } from "@/components/meetings/MeetingsTable";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  attendees: string[];
  status: string;
  location: string;
}

const MeetingsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();

  const { data: meetings, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedMeeting(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Meetings</h1>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
            <MeetingsTable
              meetings={meetings || []}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
            <MeetingDialog
              open={isDialogOpen}
              onOpenChange={handleDialogClose}
              meeting={selectedMeeting}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MeetingsPage;