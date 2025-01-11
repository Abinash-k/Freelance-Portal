import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  date: string;
  duration: number;
  attendees: string;
  location: string;
}

interface MeetingFormFieldsProps {
  form: UseFormReturn<FormData>;
}

export const MeetingFormFields = ({ form }: MeetingFormFieldsProps) => {
  return (
    <>
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
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meeting Link</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="https://zoom.us/j/123456789" />
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
    </>
  );
};