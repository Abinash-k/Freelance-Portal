import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: "",
        duration: 30,
        attendees: "",
      });
    }
  }, [meeting, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsProcessing(true);
      try {
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        if (meeting) {
          // Update existing meeting
          const { data: updatedMeeting, error } = await supabase
            .from("meetings")
            .update({
              title: data.title,
              description: data.description,
              date: new Date(data.date).toISOString(),
              duration: Number(data.duration),
              attendees: data.attendees.split(",").map((email) => email.trim()),
            })
            .eq("id", meeting.id)
            .select()
            .single();

          if (error) throw error;
          return updatedMeeting;
        } else {
          // Create new meeting
          // Call our edge function to create the meeting
          const { data: meetingData, error } = await supabase.functions.invoke('create-meeting', {
            body: {
              title: data.title,
              description: data.description,
              date: new Date(data.date).toISOString(),
              duration: Number(data.duration),
              attendees: data.attendees.split(",").map((email) => email.trim()),
              user_id: user.id,
            },
          });

          if (error) throw error;
          return meetingData;
        }
      } catch (error) {
        console.error("Error processing meeting:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Meeting ${meeting ? "updated" : "scheduled"} successfully.${
          !meeting ? " Invites have been sent." : ""
        }`,
      });
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Failed to ${meeting ? "update" : "schedule"} meeting`,
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
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Meeting title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Meeting description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="15" step="15" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendees (comma-separated emails)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="email1@example.com, email2@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {meeting ? "Update" : "Schedule"} Meeting
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};