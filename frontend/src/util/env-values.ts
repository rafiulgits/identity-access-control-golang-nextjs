export const ApiServer = process.env.NEXT_PUBLIC_API_SERVER
  ? process.env.NEXT_PUBLIC_API_SERVER
  : "http://localhost:8000";



export const GoogleAuthClientID = process.env.GOOGLE_AUTH_CLIENT_ID
  ? process.env.GOOGLE_AUTH_CLIENT_ID
  : "";


export const GoogleAuthClientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET
  ? process.env.GOOGLE_AUTH_CLIENT_SECRET
  : "";


export const AzureADClientID = process.env.AZURE_AD_CLIENT_ID
  ? process.env.AZURE_AD_CLIENT_ID
  : "";


export const AzureADClientSecret = process.env.AZURE_AD_CLIENT_SECRET
  ? process.env.AZURE_AD_CLIENT_SECRET
  : "";


export const AzureADTenantID = process.env.AZURE_AD_TENANT_ID
  ? process.env.AZURE_AD_TENANT_ID
  : "";