import * as jose from 'npm:jose@4.14.4';

export const generateZoomJWT = async (ZOOM_API_KEY: string, ZOOM_API_SECRET: string) => {
  console.log("Starting JWT token generation");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // Token expires in 1 hour

  try {
    const jwt = await new jose.SignJWT({
      iss: ZOOM_API_KEY,
      exp: exp,
    })
    .setProtectedHeader({ 
      alg: 'HS256',
      typ: 'JWT'
    })
    .sign(new TextEncoder().encode(ZOOM_API_SECRET));

    console.log("JWT token generated successfully");
    return jwt;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error(`Failed to generate Zoom JWT token: ${error}`);
  }
};