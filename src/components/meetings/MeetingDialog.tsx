import { useState } from "react";
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

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  duration: number;
  attendees: string;
}

export const MeetingDialog = ({ open, onOpenChange }: MeetingDialogProps) => {
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormData>();

  const createMeeting = useMutation({
    mutationFn: async (data: FormData) => {
      setIsCreatingMeet(true);
      try {
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

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

        toast({
          title: "Success",
          description: "Meeting scheduled successfully. Invites have been sent.",
        });

        onOpenChange(false);
        form.reset();
      } catch (error) {
        console.error("Error creating meeting:", error);
        toast({
          title: "Error",
          description: "Failed to schedule meeting",
          variant: "destructive",
        });
      } finally {
        setIsCreatingMeet(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createMeeting.mutate(data))}
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
              <Button type="submit" disabled={isCreatingMeet}>
                Schedule Meeting
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
