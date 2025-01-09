import { Calendar, Clock, Users, Video, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  attendees: string[];
  status: string;
  location: string;
  description?: string;
}

interface MeetingsTableProps {
  meetings: Meeting[];
  isLoading: boolean;
  onEdit: (meeting: Meeting) => void;
}

export const MeetingsTable = ({ meetings, isLoading, onEdit }: MeetingsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (meetingId: string) => {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error) => {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (meetingToDelete) {
      deleteMutation.mutate(meetingToDelete.id);
      setDeleteDialogOpen(false);
      setMeetingToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  {meeting.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(meeting.date), "PPp")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {meeting.duration} minutes
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {meeting.attendees?.length || 0} attendees
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    meeting.status === "scheduled"
                      ? "secondary"
                      : meeting.status === "completed"
                      ? "outline"
                      : "default"
                  }
                >
                  {meeting.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={meeting.location} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(meeting)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(meeting)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};