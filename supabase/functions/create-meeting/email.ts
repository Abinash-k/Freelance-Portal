import { Resend } from 'resend';

interface EmailParams {
  attendees: string[];
  title: string;
  description: string;
  date: string;
  duration: number;
  zoomUrl: string;
}

export const sendMeetingInvites = async (
  resend: Resend,
  params: EmailParams
) => {
  try {
    const dateObj = new Date(params.date);
    const formattedDate = dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const emailPromises = params.attendees.map(attendee =>
      resend.emails.send({
        from: 'meetings@resend.dev',
        to: attendee,
        subject: `Meeting Invitation: ${params.title}`,
        html: `
          <h2>You've been invited to: ${params.title}</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Duration:</strong> ${params.duration} minutes</p>
          ${params.description ? `<p><strong>Description:</strong> ${params.description}</p>` : ''}
          <p><strong>Zoom Link:</strong> <a href="${params.zoomUrl}">${params.zoomUrl}</a></p>
        `
      })
    );

    await Promise.all(emailPromises);
    console.log("Meeting invites sent successfully");
  } catch (error) {
    console.error("Error sending meeting invites:", error);
    throw error;
  }
};