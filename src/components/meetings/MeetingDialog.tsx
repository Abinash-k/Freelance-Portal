import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { MeetingFormFields } from "./MeetingFormFields";
import { MeetingDialogFooter } from "./MeetingDialogFooter";

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

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  duration: number;
  attendees: string;
  location: string;
}

export const MeetingDialog = ({ open, onOpenChange, meeting }: MeetingDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormData>();

  useEffect(() => {
    if (meeting) {
      form.reset({
        title: meeting.title,
        description: meeting.description || "",
        date: new Date(meeting.date).toISOString().slice(0, 16),
        duration: meeting.duration,
        attendees: meeting.attendees.join(", "),
        location: meeting.location || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: "",
        duration: 30,
        attendees: "",
        location: "",
      });
    }
  }, [meeting, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsProcessing(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const meetingData = {
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString(),
          duration: Number(data.duration),
          attendees: data.attendees.split(",").map((email) => email.trim()),
          location: data.location,
          user_id: user.id,
        };

        if (meeting) {
          // Update existing meeting
          const { error } = await supabase
            .from("meetings")
            .update(meetingData)
            .eq("id", meeting.id);

          if (error) throw error;
          return meeting;
        } else {
          // Create new meeting
          const { data: newMeeting, error } = await supabase
            .from("meetings")
            .insert([meetingData])
            .select()
            .single();

          if (error) throw error;
          return newMeeting;
        }
      } catch (error) {
        console.error("Error processing meeting:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Meeting ${meeting ? "updated" : "created"} successfully.`,
      });
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Failed to ${meeting ? "update" : "create"} meeting`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{meeting ? "Edit Meeting" : "Schedule Meeting"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {meeting ? "update" : "schedule"} your meeting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            <MeetingFormFields form={form} />
            <MeetingDialogFooter 
              onCancel={() => onOpenChange(false)}
              isProcessing={isProcessing}
              isEditing={!!meeting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};