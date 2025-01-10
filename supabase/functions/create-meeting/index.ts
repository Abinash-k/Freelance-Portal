import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ZOOM_API_KEY = Deno.env.get("ZOOM_API_KEY");
const ZOOM_API_SECRET = Deno.env.get("ZOOM_API_SECRET");

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

async function createZoomMeeting(title: string, startTime: string, durationMinutes: number) {
  if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
    console.error("Zoom API credentials are not configured");
    throw new Error("Zoom API is not configured");
  }

  console.log("Creating Zoom meeting:", { title, startTime, durationMinutes });

  try {
    // Generate JWT token for Zoom API authentication
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: ZOOM_API_KEY,
      exp: now + 300, // 5 minutes from now
    };

    console.log("Generating JWT token with payload:", payload);

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(new TextEncoder().encode(ZOOM_API_SECRET));

    console.log("JWT token generated successfully");

    // Create Zoom meeting
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: title,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: durationMinutes,
        timezone: 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: false,
        }
      })
    });

    const responseText = await response.text();
    console.log("Zoom API response:", responseText);

    if (!response.ok) {
      console.error("Zoom API error response:", responseText);
      throw new Error(`Failed to create Zoom meeting: ${responseText}`);
    }

    const meetingData = JSON.parse(responseText);
    console.log("Zoom meeting created successfully:", meetingData);
    return meetingData.join_url;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    throw error;
  }
}

async function sendEmailInvites(meetingDetails: {
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
}) {
  const { title, description, date, location, attendees } = meetingDetails;
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    throw new Error("Email service is not configured");
  }

  console.log("Starting to send email invites to:", attendees);
  const failedEmails = [];
  
  for (const attendee of attendees) {
    try {
      console.log(`Sending email to ${attendee}...`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Meetings <onboarding@resend.dev>",
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
        const errorData = await res.text();
        console.error(`Failed to send email to ${attendee}:`, errorData);
        failedEmails.push(attendee);
      } else {
        console.log(`Successfully sent email to ${attendee}`);
      }
    } catch (error) {
      console.error(`Error sending email to ${attendee}:`, error);
      failedEmails.push(attendee);
    }
  }

  if (failedEmails.length > 0) {
    throw new Error(`Failed to send emails to: ${failedEmails.join(", ")}`);
  }

  console.log("Successfully sent all email invites");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const meetingRequest: MeetingRequest = await req.json();
    const { title, description, date, duration, attendees, user_id } = meetingRequest;

    console.log("Creating meeting:", { title, date, attendees });

    // Create Zoom meeting
    const meetLink = await createZoomMeeting(title, date, duration);
    console.log("Created Zoom meeting link:", meetLink);

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

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    // Send email invites
    try {
      await sendEmailInvites({
        title,
        description,
        date,
        location: meetLink,
        attendees,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Even if email sending fails, we'll return the created meeting
      return new Response(
        JSON.stringify({ 
          meeting,
          warning: "Meeting created but there were issues sending some email invites"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});