import * as jose from 'npm:jose@4.14.4';

export const generateZoomJWT = async (ZOOM_API_KEY: string, ZOOM_API_SECRET: string) => {
  console.log("Starting JWT token generation for Zoom");
  
  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // Token expires in 1 hour

    // Create JWT payload according to Zoom API requirements
    const payload = {
      iss: ZOOM_API_KEY,
      exp: exp
    };

    // Sign the JWT with proper headers
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ 
        alg: 'HS256',
        typ: 'JWT'
      })
      .sign(new TextEncoder().encode(ZOOM_API_SECRET));

    console.log("Successfully generated Zoom JWT token");
    return jwt;
  } catch (error) {
    console.error("Error generating Zoom JWT token:", error);
    throw new Error(`Failed to generate Zoom JWT token: ${error.message}`);
  }
};