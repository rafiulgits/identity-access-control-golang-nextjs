import { AuthService } from "@/service/auth";


const credentialSigninConfig = {
  id: "credential",
  name: "credential",
  credentials: {
    name: { label: "Email", type: "text" },
    secret: { label: "Password", type: "password" },
  },

  authorize: async (credentials: any, req: any) => {
    const { callbackUrl, redirect, ...userData } = credentials;
    try {
      const loginData = await AuthService.credentialLogin(userData);
      const profileData = await AuthService.getProfile(loginData.bearer);
      return {
        ...profileData,
        accessToken: loginData.bearer,
      };
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
};


const authHandler = async (ctx: any) => {
  return ctx.user;
};

const getUserProfile = async (ctx: any) => {
  const profile = await AuthService.getProfile(ctx.user.accessToken);
  return {
    ...profile,
    accessToken: ctx.user.accessToken,
  };
};

const isCredentialProvider = (provider: string) => {
  return (
    provider === credentialSigninConfig.id
  );
};

export const CredentialAuth = {
  config: credentialSigninConfig,
  handle: authHandler,
  getProfile: getUserProfile,
  canProvide: isCredentialProvider,
};

