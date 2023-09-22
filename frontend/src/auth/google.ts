import { AuthService } from "@/service/auth";
import { GoogleAuthClientID, GoogleAuthClientSecret } from "@/util/env-values";


const googleSigninConfig = {
  id: "google",
  name: "google",
  clientId: GoogleAuthClientID,
  clientSecret: GoogleAuthClientSecret,
};

const authHandler = async (ctx: any) => {
  try {
    const data = {
      provider: "google",
      accessToken: ctx.account.access_token,
    };
    await AuthService.googleLogin(data);
    return true;
  } catch (err: any) {
    console.log(err)
    return `/auth/login?error=${err.message}`;
  }
}


const getUserProfile = async (ctx: any) => {
  const data = {
    provider: "google",
    accessToken: ctx.account.access_token,
  };
  const access = await AuthService.googleLogin(data);
  const profile = await AuthService.getProfile(access.bearer);
  return {
    ...profile,
    accessToken: access.bearer,
  };
};

const isGoogleProvider = (provider: string) => {
  return (
    provider === googleSigninConfig.id
  );
};

export const GoogleAuth = {
  config: googleSigninConfig,
  handle: authHandler,
  getProfile: getUserProfile,
  canProvide: isGoogleProvider,
};

