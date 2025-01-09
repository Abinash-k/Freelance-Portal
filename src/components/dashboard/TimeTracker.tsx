import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProjectDialog } from "./ProjectDialog";

interface TimeTrackerFormValues {
  project_id: string;
  description: string;
}

export const TimeTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<TimeTrackerFormValues>();

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("Current user ID:", user.id);
      }
    };
    getUserId();
  }, []);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleStartTimer = async (values: TimeTrackerFormValues) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (!values.project_id || !values.description) {
      toast({
        title: "Error",
        description: "Please select a project and add a description",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    setStartTime(now);
    setIsTracking(true);

    const { error } = await supabase
      .from('time_entries')
      .insert({
        project_id: values.project_id,
        description: values.description,
        start_time: now.toISOString(),
        user_id: userId
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start time tracking",
        variant: "destructive",
      });
      console.error("Error starting timer:", error);
      return;
    }

    toast({
      title: "Timer Started",
      description: "Time tracking has begun",
    });
  };

  const handleStopTimer = async () => {
    if (!startTime || !userId) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const { error } = await supabase
      .from('time_entries')
      .update({
        end_time: endTime.toISOString(),
        duration: duration,
      })
      .eq('start_time', startTime.toISOString())
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to stop time tracking",
        variant: "destructive",
      });
      console.error("Error stopping timer:", error);
      return;
    }

    setIsTracking(false);
    setStartTime(null);
    form.reset();
    
    toast({
      title: "Timer Stopped",
      description: "Time entry has been saved",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Time Tracker</h2>
        <ProjectDialog />
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStartTimer)} className="space-y-4">
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border rounded-md p-2"
                        {...field}
                        disabled={isTracking}
                      >
                        <option value="">Select a project</option>
                        {projects?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
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
                      <Textarea
                        placeholder="What are you working on?"
                        className="resize-none"
                        {...field}
                        disabled={isTracking}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isTracking ? (
                <Button type="submit" className="w-full gap-2">
                  <Clock className="h-4 w-4" /> Start Timer
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleStopTimer}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <Clock className="h-4 w-4" /> Stop Timer
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};