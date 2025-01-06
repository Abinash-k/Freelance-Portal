import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MeetingsTable } from "@/components/meetings/MeetingsTable";
import { MeetingDialog } from "@/components/meetings/MeetingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MeetingsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Meetings</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
      <MeetingsTable meetings={meetings || []} isLoading={isLoading} />
      <MeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default MeetingsPage;