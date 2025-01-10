import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

interface MeetingData {
  title: string;
  description?: string;
  date: string;
  duration: number;
  attendees: string[];
  user_id: string;
  location?: string;
}

export const createMeetingRecord = async (
  supabaseClient: ReturnType<typeof createClient>,
  meetingData: MeetingData,
  zoomUrl: string
) => {
  try {
    const { data, error } = await supabaseClient
      .from('meetings')
      .insert({
        ...meetingData,
        location: zoomUrl,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating meeting record:", error);
    throw error;
  }
};