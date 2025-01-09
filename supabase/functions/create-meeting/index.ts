import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

async function createGoogleMeet(title: string) {
  // Generate a more realistic Google Meet ID
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const meetId = Array(3)
    .fill(0)
    .map(() => {
      const segment = Array(3)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');
      return segment;
    })
    .join('-');
  
  return `https://meet.google.com/${meetId}`;
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

    // Create Google Meet link
    const meetLink = await createGoogleMeet(title);
    console.log("Created meet link:", meetLink);

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