export const ApiServer = process.env.NEXT_PUBLIC_API_SERVER
  ? process.env.NEXT_PUBLIC_API_SERVER
  : "http://localhost:8000";



export const GoogleAuthClientID = process.env.GOOGLE_AUTH_CLIENT_ID
  ? process.env.GOOGLE_AUTH_CLIENT_ID
  : "";


export const GoogleAuthClientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET
  ? process.env.GOOGLE_AUTH_CLIENT_SECRET
  : "";