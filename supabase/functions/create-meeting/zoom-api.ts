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
      },
      body: JSON.stringify({
        ...meetingParams,
        settings: {
          join_before_host: true,
          waiting_room: false,
          host_video: true,
          participant_video: true,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Zoom API error response:", errorText);
      throw new Error(`Failed to create Zoom meeting: ${errorText}`);
    }

    const meetingData = await response.json();
    console.log("Successfully created Zoom meeting:", meetingData);
    return meetingData.join_url;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    throw error;
  }
};