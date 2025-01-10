interface CreateMeetingParams {
  topic: string;
  duration: number;
  start_time: string;
  type: number;
}

export const createZoomMeeting = async (
  jwt: string, 
  meetingParams: CreateMeetingParams
) => {
  console.log("Creating Zoom meeting with params:", meetingParams);
  
  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Zoom-api-Jwt-Request',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...meetingParams,
        settings: {
          join_before_host: true,
          waiting_room: false,
          host_video: true,
          participant_video: true,
          auto_recording: 'none'
        }
      }),
    });

    const responseText = await response.text();
    console.log("Zoom API response status:", response.status);
    console.log("Zoom API response headers:", Object.fromEntries(response.headers));
    console.log("Zoom API response body:", responseText);

    if (!response.ok) {
      throw new Error(`Zoom API error: ${responseText}`);
    }

    const meetingData = JSON.parse(responseText);
    console.log("Successfully created Zoom meeting:", meetingData);
    return meetingData.join_url;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    throw error;
  }
};