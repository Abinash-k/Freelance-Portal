import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'npm:resend@1.0.0';
import { corsHeaders } from '../_shared/cors.ts';
import { generateZoomJWT } from './zoom-auth.ts';
import { createZoomMeeting } from './zoom-api.ts';
import { createMeetingRecord } from './database.ts';
import { sendMeetingInvites } from './email.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const ZOOM_API_KEY = Deno.env.get('ZOOM_API_KEY')!;
    const ZOOM_API_SECRET = Deno.env.get('ZOOM_API_SECRET')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const resend = new Resend(RESEND_API_KEY);

    const { title, description, date, duration, attendees, user_id } = await req.json();

    // Create Zoom meeting
    const jwt = await generateZoomJWT(ZOOM_API_KEY, ZOOM_API_SECRET);
    const zoomUrl = await createZoomMeeting(jwt, {
      topic: title,
      duration,
      start_time: date,
      type: 2, // Scheduled meeting
    });

    // Create meeting record in database
    const meetingRecord = await createMeetingRecord(supabase, {
      title,
      description,
      date,
      duration,
      attendees,
      user_id,
      location: zoomUrl,
    }, zoomUrl);

    // Send email invites
    await sendMeetingInvites(resend, {
      attendees,
      title,
      description,
      date,
      duration,
      zoomUrl,
    });

    return new Response(
      JSON.stringify(meetingRecord),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-meeting function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});