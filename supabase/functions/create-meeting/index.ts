import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { google } from "https://esm.sh/@googleapis/calendar@9.6.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MeetingRequest {
  title: string;
  description: string;
  date: string;
  duration: number;
  attendees: string[];
  user_id: string;
}

async function createGoogleMeet(title: string, startTime: string, duration: number) {
  // This is a simplified version. In production, you'd need to handle OAuth2 flow
  const meetingId = Math.random().toString(36).substring(7);
  return `https://meet.google.com/${meetingId}`;
}

async function sendEmailInvites(meetingDetails: {
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
}) {
  const { title, description, date, location, attendees } = meetingDetails;
  
  try {
    const emailPromises = attendees.map(async (attendee) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "meetings@yourdomain.com",
          to: attendee,
          subject: `Meeting Invitation: ${title}`,
          html: `
            <h2>You've been invited to a meeting</h2>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
            <p><strong>Join Link:</strong> <a href="${location}">${location}</a></p>
          `,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send email to ${attendee}`);
      }
    });

    await Promise.all(emailPromises);
  } catch (error) {
    console.error("Error sending email invites:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const meetingRequest: MeetingRequest = await req.json();
    const { title, description, date, duration, attendees, user_id } = meetingRequest;

    // Create Google Meet link
    const meetLink = await createGoogleMeet(title, date, duration);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert meeting into database
    const { data: meeting, error: dbError } = await supabaseClient
      .from('meetings')
      .insert({
        title,
        description,
        date,
        duration,
        location: meetLink,
        attendees,
        status: 'scheduled',
        user_id,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Send email invites
    await sendEmailInvites({
      title,
      description,
      date,
      location: meetLink,
      attendees,
    });

    return new Response(
      JSON.stringify({ success: true, meeting }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating meeting:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});