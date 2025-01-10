import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

interface MeetingData {
  title: string;
  description?: string;
  date: string;
  duration: number;
  attendees: string[];
  user_id: string;
  location: string;
}

export const createMeetingRecord = async (
  supabaseClient: ReturnType<typeof createClient>,
  meetingData: MeetingData
) => {
  try {
    console.log("Creating meeting record with data:", meetingData);
    
    const { data, error } = await supabaseClient
      .from('meetings')
      .insert({
        ...meetingData,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }
    
    console.log("Successfully created meeting record:", data);
    return data;
  } catch (error) {
    console.error("Error creating meeting record:", error);
    throw error;
  }
};