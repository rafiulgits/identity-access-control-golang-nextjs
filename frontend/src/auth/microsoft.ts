import { AuthService } from "@/service/auth";
import { AzureADClientID, AzureADClientSecret, AzureADTenantID, } from "@/util/env-values";


const microsoftSigninConfig = {
  id: "microsoft",
  name: "microsoft",
  clientId: AzureADClientID,
  clientSecret: AzureADClientSecret,
  tenantId: AzureADTenantID,
  authorization: {
    params: { scope: 'openid email profile User.Read  offline_access' },
  },
  httpOptions: { timeout: 10000 }
};

const authHandler = async (ctx: any) => {
  try {
    const data = {
      provider: "microsoft",
      accessToken: ctx.account.access_token,
    };
    await AuthService.microsoftLogin(data);
    return true;
  } catch (err: any) {
    console.log(err)
    return `/auth/login?error=${err.message}`;
  }
}


const getUserProfile = async (ctx: any) => {
  const data = {
    provider: "microsoft",
    accessToken: ctx.account.access_token,
  };
  const access = await AuthService.microsoftLogin(data);
  const profile = await AuthService.getProfile(access.bearer);
  return {
    ...profile,
    accessToken: access.bearer,
  };
};

const isMicrosoftProvider = (provider: string) => {
  return (
    provider === microsoftSigninConfig.id
  );
};

export const MicrosoftAuth = {
  config: microsoftSigninConfig,
  handle: authHandler,
  getProfile: getUserProfile,
  canProvide: isMicrosoftProvider,
};

